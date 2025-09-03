{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run" 
          "dev"
        ];
        env = {
          PORT = "$PORT";
        };
        manager = "web";
      };
    };
  };
}