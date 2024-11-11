import React, { useState } from "react";
import { marked } from "marked";
import "./App.css";

function App() {
  const [apiUrl, setApiUrl] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState("html");
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch JSON data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      setJsonData(JSON.stringify(data, null, 2));
      setStatusMessage("Data fetched successfully.");
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  // Convert JSON to HTML recursively
  const jsonToHTML = (data) => {
    if (typeof data === "object" && data !== null) {
      return (
        "<div>" +
        Object.keys(data)
          .map(
            (key) =>
              `<div><strong>${key}:</strong> ${jsonToHTML(data[key])}</div>`
          )
          .join("") +
        "</div>"
      );
    }
    return `<span>${data}</span>`;
  };

  // Render JSON as HTML or Markdown
  // Validate and Render JSON data
const renderOutput = () => {
  try {
    const parsedData = JSON.parse(jsonData);  // Attempt to parse JSON
    if (outputType === "html") {
      setOutput(jsonToHTML(parsedData));  // Render as HTML
    } else {
      setOutput(marked(JSON.stringify(parsedData, null, 2)));  // Render as Markdown
    }
    setStatusMessage("Rendering successful.");
  } catch (error) {
    // Catch parsing error and set status message
    setStatusMessage("Error: Invalid JSON format. Please check and try again.");
    setOutput('')
  }
};



  return (
    <div className=" flex flex-col h-[100vh] w-full px-10 py-10 items-center max-w-[1440px] mx-auto ">
      
      <h1 className="text-3xl font-semibold" >API JSON Renderer</h1>
    <div className="flex justify-between w-full px-6 py-10" >
    <div className="flex flex-col gap-6 max-w-[50%] w-full " >
     <div className=" flex gap-4 max-w-[450px] w-full">
        <input
          type="text"
          placeholder="Enter API endpoint"
          value={apiUrl}
          className=" border-black border-2 rounded-lg px-3 w-full text-sm "
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <button className=" bg-green-500 text-white  px-[20px] py-[10px] rounded-lg font-semibold" onClick={fetchData}>GET</button>
      </div>

      <div className="  border-black/30 border-2 rounded-lg p-2 max-w-[450px] w-full">
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="JSON data will appear here..."
          rows={15}
         className="resize-none overflow-y-auto outline-none w-full"
        />
      </div>

      <div className=" flex max-w-[450px] w-full gap-4">
        <select
          value={outputType}
           className=" border-black border-2 rounded-lg px-3 w-full text-sm "
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="html">HTML</option>
          <option value="markdown">Markdown</option>
        </select>
        <button className=" bg-green-500 text-white  px-[20px] py-[10px] rounded-lg font-semibold" onClick={renderOutput}>Render</button>
      </div>
     </div>

      <div className=" max-w-[50%] flex flex-col gap-3 w-full">
        <h2 className="text-2xl font-semibold">Rendered Output:</h2>
        <div className="">  {statusMessage}</div>
        <div
          className="  h-[440px]  border-black/30 border-2 rounded-lg p-2 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: output }}
        ></div>
      </div>

     
    </div>
    </div>
  );
}

export default App;
