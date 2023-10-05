import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupForm } from "./form.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <form id="form">
          <label for="email">Email:</label>
          <input type="email" name="email" id="email" required><br><br>

          <label for="images">Select Images:</label>
          <input type="file" name="images" id="images" multiple accept="image/*" required><br><br>

          <input type="submit" value="Upload">
      </form>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupForm(document.querySelector<HTMLFormElement>("#form")!);
