import "./index.css";

const App = () => {
  const versionInfo = `NodeJS:${window.electronAPI.versions.node()} | Chrome:${window.electronAPI.versions.chrome()} | Electron:${window.electronAPI.versions.electron()}`;
  const closeHandler = () => {
    window.electronAPI.send.close();
  };

  const dummy = ["task01", "task02", "task03"];

  return (
    <div>
      <p>{versionInfo}</p>
      {dummy.map((elem) => (
        <div>{elem}</div>
      ))}
      <button onClick={closeHandler}>Close</button>
    </div>
  );
};

export default App;
