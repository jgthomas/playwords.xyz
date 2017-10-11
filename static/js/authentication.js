document.addEventListener("DOMContentLoaded", () => {
  const showPass = document.getElementById("show-pass");
  showPass.addEventListener("change", () => {
      const toggleShow = document.getElementById("pwd");
      if (toggleShow.type === "password") {
          toggleShow.type = "text";
      } else {
          toggleShow.type = "password";
      }
  });
});
