<script>
  import { onMount } from "svelte";
  import { isAuthenticated } from "./lib/auth";
  import Login from "./lib/Login.svelte";
  import Dashboard from "./lib/Dashboard.svelte";
  import Report from "./lib/Report.svelte";

  let currentRoute = window.location.hash.slice(1) || "/";

  function onHashChange() {
    currentRoute = window.location.hash.slice(1) || "/";
    checkAuth();
  }

  function checkAuth() {
    const isAuth = isAuthenticated();
    if (!isAuth && currentRoute !== "/login") {
      if (window.location.hash !== "#/login") {
        window.location.hash = "/login";
      }
    } else if (isAuth && currentRoute === "/login") {
      if (window.location.hash !== "#/dashboard") {
        window.location.hash = "/dashboard";
      }
    }
  }

  onMount(() => {
    checkAuth();
    if (isAuthenticated() && (currentRoute === "/" || currentRoute === "")) {
      window.location.hash = "/dashboard";
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });
</script>

<main>
  {#if currentRoute === "/login"}
    <Login />
  {:else if currentRoute.startsWith("/reports/")}
    <Report id={currentRoute.split("/")[2]} />
  {:else}
    <Dashboard />
  {/if}
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }
</style>
