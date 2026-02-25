<script>
  import { onMount } from "svelte";
  import { api, removeToken, getToken } from "./auth";

  let currentUser = null;
  let reports = [];
  let users = [];
  let projects = [];
  let newReportContent = "";
  let selectedProject = "";
  let loading = true;
  let creating = false;
  let activeTab = "reports";

  // Settings
  let newPassword = "";
  let changingPassword = false;

  // New user form
  let showUserForm = false;
  let newUser = {
    username: "",
    password: "",
    role: "employee",
    rank: "junior",
    managerId: null,
  };
  let creatingUser = false;

  // New project form
  let showProjectForm = false;
  let newProject = { name: "", description: "", leaderId: null };
  let creatingProject = false;

  // Filters
  let filters = {
    userId: "",
    projectId: "",
    startDate: "",
    endDate: "",
    search: "",
  };

  onMount(async () => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUser = payload;
      } catch (e) {
        console.error(e);
      }
    }
    await fetchReports();
    await fetchProjects();
    if (currentUser?.role === "admin") {
      await fetchUsers();
    }
  });

  async function fetchReports() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.projectId) params.append("projectId", filters.projectId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.search) params.append("search", filters.search);

      const query = params.toString();
      reports = await api(`/daily${query ? "?" + query : ""}`);
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function fetchUsers() {
    try {
      users = await api("/users");
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchProjects() {
    try {
      projects = await api("/projects");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSubmit() {
    if (!newReportContent.trim()) return;
    creating = true;
    try {
      const data = { content: newReportContent };
      if (selectedProject) data.projectId = parseInt(selectedProject);

      await api("/daily", {
        method: "POST",
        body: JSON.stringify(data),
      });
      newReportContent = "";
      selectedProject = "";
      await fetchReports();
    } catch (e) {
      alert(e.message);
    } finally {
      creating = false;
    }
  }

  async function handleCreateUser() {
    if (!newUser.username || !newUser.password) {
      alert("Username and password are required");
      return;
    }
    creatingUser = true;
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      showUserForm = false;
      newUser = {
        username: "",
        password: "",
        role: "employee",
        rank: "junior",
        managerId: null,
      };
      await fetchUsers();
      alert("User created successfully");
    } catch (e) {
      alert(e.message);
    } finally {
      creatingUser = false;
    }
  }

  async function handleCreateProject() {
    if (!newProject.name) {
      alert("Project name is required");
      return;
    }
    creatingProject = true;
    try {
      await api("/projects", {
        method: "POST",
        body: JSON.stringify(newProject),
      });
      showProjectForm = false;
      newProject = { name: "", description: "", leaderId: null };
      await fetchProjects();
      alert("Project created successfully");
    } catch (e) {
      alert(e.message);
    } finally {
      creatingProject = false;
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      await fetchUsers();
      alert("User deleted");
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteProject(id) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api(`/projects/${id}`, { method: "DELETE" });
      await fetchProjects();
      alert("Project deleted");
    } catch (e) {
      alert(e.message);
    }
  }

  function handleLogout() {
    removeToken();
    window.location.hash = "/login";
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    changingPassword = true;
    try {
      await api("/users/change-password", {
        method: "POST",
        body: JSON.stringify({ newPassword }),
      });
      alert("Password updated successfully");
      newPassword = "";
    } catch (e) {
      alert(e.message);
    } finally {
      changingPassword = false;
    }
  }

  function applyFilters() {
    fetchReports();
  }

  function clearFilters() {
    filters = {
      userId: "",
      projectId: "",
      startDate: "",
      endDate: "",
      search: "",
    };
    fetchReports();
  }

  function getRoleLabel(role) {
    const labels = {
      admin: "Admin",
      team_leader: "Team Leader",
      employee: "Employee",
    };
    return labels[role] || role;
  }

  function getRankLabel(rank) {
    const labels = {
      junior: "Junior",
      middle: "Middle",
      senior: "Senior",
      lead: "Lead",
      manager: "Manager",
    };
    return labels[rank] || rank;
  }
</script>

<div class="container fade-in">
  <header>
    <div class="header-left">
      <h1>Daily Reports</h1>
      {#if currentUser}
        <span class="user-info">
          {currentUser.username} ({getRoleLabel(currentUser.role)} - {getRankLabel(
            currentUser.rank || "junior",
          )})
        </span>
      {/if}
    </div>
    <button class="logout-btn" on:click={handleLogout}>Logout</button>
  </header>

  <nav class="tabs">
    <button
      class:active={activeTab === "reports"}
      on:click={() => (activeTab = "reports")}>Reports</button
    >
    {#if currentUser?.role === "admin"}
      <button
        class:active={activeTab === "users"}
        on:click={() => (activeTab = "users")}>Users</button
      >
      <button
        class:active={activeTab === "projects"}
        on:click={() => (activeTab = "projects")}>Projects</button
      >
    {/if}
    <button
      class:active={activeTab === "settings"}
      on:click={() => (activeTab = "settings")}>Settings</button
    >
  </nav>

  {#if activeTab === "reports"}
    <div class="card create-section">
      <h3>New Daily Report</h3>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label>Project (Optional)</label>
          <select bind:value={selectedProject}>
            <option value="">No Project</option>
            {#each projects as project}
              <option value={project.id}>{project.name}</option>
            {/each}
          </select>
        </div>
        <textarea
          bind:value={newReportContent}
          placeholder="What did you work on today?"
          rows="4"
        ></textarea>
        <div style="text-align: right;">
          <button type="submit" disabled={creating}>
            {creating ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>

    <div class="card filter-section">
      <h3>Filter Reports</h3>
      <div class="filter-grid">
        <div class="filter-group">
          <label>Search</label>
          <input
            type="text"
            bind:value={filters.search}
            placeholder="Search in content..."
          />
        </div>
        <div class="filter-group">
          <label>User</label>
          <select bind:value={filters.userId}>
            <option value="">All Users</option>
            {#each users as user}
              <option value={user.id}>{user.username}</option>
            {/each}
          </select>
        </div>
        <div class="filter-group">
          <label>Project</label>
          <select bind:value={filters.projectId}>
            <option value="">All Projects</option>
            {#each projects as project}
              <option value={project.id}>{project.name}</option>
            {/each}
          </select>
        </div>
        <div class="filter-group">
          <label>Start Date</label>
          <input type="date" bind:value={filters.startDate} />
        </div>
        <div class="filter-group">
          <label>End Date</label>
          <input type="date" bind:value={filters.endDate} />
        </div>
      </div>
      <div class="filter-actions">
        <button class="secondary" on:click={clearFilters}>Clear</button>
        <button on:click={applyFilters}>Apply Filters</button>
      </div>
    </div>

    <div class="reports-section">
      <h3>Reports History</h3>
      {#if loading}
        <p>Loading reports...</p>
      {:else if reports.length === 0}
        <p style="color: #888;">No reports found.</p>
      {:else}
        <div class="reports-grid">
          {#each reports as report}
            <div class="report-card">
              <div class="report-header">
                <span class="date"
                  >{new Date(report.date).toLocaleDateString()}
                  {new Date(report.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span
                >
                {#if report.project}
                  <span class="project-badge">{report.project.name}</span>
                {/if}
              </div>
              <div class="report-meta">
                {#if report.user}
                  <span class="user-badge">{report.user.username}</span>
                {/if}
                {#if report.user?.rank}
                  <span class="rank-badge"
                    >{getRankLabel(report.user.rank)}</span
                  >
                {/if}
              </div>
              <div class="report-content">
                {report.content.substring(0, 100)}{report.content.length > 100
                  ? "..."
                  : ""}
              </div>
              <div
                class="report-actions"
                style="margin-top: 10px; text-align: right;"
              >
                <a
                  href="#/reports/{report.id}"
                  style="color: #646cff; text-decoration: none; font-size: 0.9rem;"
                  >View Full Report &rarr;</a
                >
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else if activeTab === "users"}
    <div class="card">
      <div class="section-header">
        <h3>User Management</h3>
        <button on:click={() => (showUserForm = !showUserForm)}>
          {showUserForm ? "Cancel" : "+ New User"}
        </button>
      </div>

      {#if showUserForm}
        <form class="user-form" on:submit|preventDefault={handleCreateUser}>
          <div class="form-row">
            <div class="form-group">
              <label>Username</label>
              <input type="text" bind:value={newUser.username} required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" bind:value={newUser.password} required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Role</label>
              <select bind:value={newUser.role}>
                <option value="employee">Employee</option>
                <option value="team_leader">Team Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label>Rank</label>
              <select bind:value={newUser.rank}>
                <option value="junior">Junior</option>
                <option value="middle">Middle</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div class="form-group">
              <label>Manager</label>
              <select bind:value={newUser.managerId}>
                <option value={null}>No Manager</option>
                {#each users.filter((u) => u.role !== "employee") as user}
                  <option value={user.id}
                    >{user.username} ({getRoleLabel(user.role)})</option
                  >
                {/each}
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" disabled={creatingUser}>
              {creatingUser ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      {/if}

      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Rank</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td
                ><span class="role-badge {user.role}"
                  >{getRoleLabel(user.role)}</span
                ></td
              >
              <td
                ><span class="rank-badge {user.rank}"
                  >{getRankLabel(user.rank || "junior")}</span
                ></td
              >
              <td>{user.manager?.username || "-"}</td>
              <td>
                {#if user.id !== currentUser?.id}
                  <button
                    class="danger"
                    on:click={() => handleDeleteUser(user.id)}>Delete</button
                  >
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if activeTab === "projects"}
    <div class="card">
      <div class="section-header">
        <h3>Project Management</h3>
        <button on:click={() => (showProjectForm = !showProjectForm)}>
          {showProjectForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {#if showProjectForm}
        <form class="user-form" on:submit|preventDefault={handleCreateProject}>
          <div class="form-row">
            <div class="form-group">
              <label>Project Name</label>
              <input type="text" bind:value={newProject.name} required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <input type="text" bind:value={newProject.description} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Project Lead</label>
              <select bind:value={newProject.leaderId}>
                <option value={null}>No Lead</option>
                {#each users as user}
                  <option value={user.id}>{user.username}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" disabled={creatingProject}>
              {creatingProject ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      {/if}

      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Lead</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each projects as project}
            <tr>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description || "-"}</td>
              <td>{project.leader?.username || "-"}</td>
              <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  class="danger"
                  on:click={() => handleDeleteProject(project.id)}
                  >Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if activeTab === "settings"}
    <div class="card">
      <div class="section-header">
        <h3>User Settings</h3>
      </div>

      <form
        class="user-form"
        style="max-width: 400px;"
        on:submit|preventDefault={handleChangePassword}
      >
        <div class="form-group">
          <label>New Password</label>
          <input
            type="password"
            bind:value={newPassword}
            placeholder="Enter new password (min. 6 characters)"
            required
            minlength="6"
          />
        </div>
        <div class="form-actions" style="text-align: left;">
          <button type="submit" disabled={changingPassword}>
            {changingPassword ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    background: #1a1a1a;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header-left h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #fff;
  }

  .user-info {
    color: #aaa;
    font-size: 0.9rem;
    display: block;
    margin-top: 4px;
  }

  .logout-btn {
    background: transparent;
    border: 1px solid #444;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    color: #fff;
  }

  .logout-btn:hover {
    background: #333;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tabs button {
    padding: 10px 20px;
    border: none;
    background: #333;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    color: #aaa;
  }

  .tabs button.active {
    background: #242424;
    border-bottom: 2px solid #646cff;
    color: #fff;
  }

  .card {
    background: #242424;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
  }

  .card h3 {
    margin-top: 0;
    color: #fff;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #aaa;
  }

  .form-group input,
  .form-group select,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
    background: #1a1a1a;
    color: #fff;
  }

  button {
    background: #646cff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.secondary {
    background: #444;
    color: #fff;
  }

  button.danger {
    background: #ff4444;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }

  .filter-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #aaa;
  }

  .filter-group input,
  .filter-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    box-sizing: border-box;
    background: #1a1a1a;
    color: #fff;
  }

  .filter-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .reports-grid {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .report-card {
    background: #242424;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 15px;
    color: #fff;
  }

  .report-card:hover {
    border-color: #646cff;
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.85rem;
    color: #888;
  }

  .report-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  .user-badge {
    background: rgba(100, 108, 255, 0.2);
    color: #7b83ff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .project-badge {
    background: rgba(76, 175, 80, 0.2);
    color: #6fbf65;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .rank-badge {
    background: rgba(255, 152, 0, 0.2);
    color: #ffb74d;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .rank-badge.senior,
  .rank-badge.lead {
    background: rgba(76, 175, 80, 0.2);
    color: #6fbf65;
  }

  .rank-badge.manager {
    background: rgba(156, 39, 176, 0.2);
    color: #ba68c8;
  }

  .report-content {
    white-space: pre-wrap;
    line-height: 1.5;
    color: #ddd;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .user-form {
    background: #1a1a1a;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #333;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }

  .form-actions {
    text-align: right;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table th,
  .users-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #333;
    color: #ddd;
  }

  .users-table th {
    background: #1a1a1a;
    font-weight: 600;
    color: #fff;
  }

  .role-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }

  .role-badge.admin {
    background: rgba(255, 68, 68, 0.2);
    color: #ff6b6b;
  }

  .role-badge.team_leader {
    background: rgba(255, 170, 0, 0.2);
    color: #ffb74d;
  }

  .role-badge.employee {
    background: rgba(76, 175, 80, 0.2);
    color: #6fbf65;
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
