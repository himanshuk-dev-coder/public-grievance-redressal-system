import fs from "fs/promises";
import path from "path";
import ejs from "ejs"
import mjml2html from "mjml";

export const getHtmlfromMjmlTemplate = async (template, data) => {

  // 1. We need to Read the File Data
  const mjmlFilePath = path.join(import.meta.dirname, "..", "emails", `${template}.mjml`);

  const mjmlTemplate = await fs.readFile(mjmlFilePath, "utf-8");

  //   console.log("mjmlFilePath : ", mjmlFilePath);

  // 2. We need to replace the Placeholders with Actual Data
  const filledTemplate = ejs.render(mjmlTemplate, data);

  //   console.log("data : ",data);

  // 3. We need to convert that File into HTML file
  return mjml2html(filledTemplate).html;
}