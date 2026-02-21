<script>
    export let id;
    import { onMount } from "svelte";
    import { api } from "./auth";

    let report = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            report = await api(`/daily/${id}`);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function goBack() {
        window.location.hash = "/dashboard";
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
    <button class="secondary" on:click={goBack}>&larr; Back to Dashboard</button
    >

    {#if loading}
        <p>Loading report...</p>
    {:else if error}
        <div class="error-card">
            <p class="error">{error}</p>
        </div>
    {:else if report}
        <div class="card report-detail">
            <div class="header">
                <h2>Report #{report.id}</h2>
                <span class="date">
                    {new Date(report.date).toLocaleDateString()}
                    {new Date(report.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
            <div class="meta">
                <div class="meta-item">
                    <span class="label">User:</span>
                    {#if report.user}
                        <span class="user-badge">{report.user.username}</span>
                        {#if report.user.rank}
                            <span class="rank-badge {report.user.rank}"
                                >{getRankLabel(report.user.rank)}</span
                            >
                        {/if}
                    {:else}
                        <span>Unknown</span>
                    {/if}
                </div>
                <div class="meta-item">
                    <span class="label">Project:</span>
                    {#if report.project}
                        <span class="project-badge">{report.project.name}</span>
                    {:else}
                        <span>No Project</span>
                    {/if}
                </div>
            </div>
            <div class="content">
                <p>{report.content}</p>
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        color: #fff;
    }
    .card {
        background: #242424;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 25px;
        margin-top: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #444;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }
    .header h2 {
        margin: 0;
        color: #646cff;
    }
    .date {
        color: #888;
        font-size: 0.9rem;
    }
    .meta {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        background: #1a1a1a;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #333;
    }
    .meta-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .label {
        color: #aaa;
        width: 60px;
    }
    .content {
        margin-top: 20px;
        white-space: pre-wrap;
        line-height: 1.6;
        font-size: 1.05rem;
    }
    button {
        background: #444;
        color: white;
        border: 1px solid #555;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }
    button:hover {
        background: #555;
    }
    .error-card {
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid #ff4444;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    .error {
        color: #ff4444;
        margin: 0;
    }

    /* Badges copied from Dashboard for consistency */
    .user-badge {
        background: rgba(100, 108, 255, 0.2);
        color: #7b83ff;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85rem;
    }
    .project-badge {
        background: rgba(76, 175, 80, 0.2);
        color: #6fbf65;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85rem;
    }
    .rank-badge {
        background: rgba(255, 152, 0, 0.2);
        color: #ffb74d;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85rem;
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

    .fade-in {
        animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
