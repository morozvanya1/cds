import "./App.css";

function App() {
  // var cors_api_url = "https://cors-anywhere.herokuapp.com/";
  function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    // x.open(options.method, cors_api_url + options.url);
    x.open(options.method, options.url);
    x.onload = x.onerror = function () {
      printResult(x.responseText);
    };
    x.send(options.data);
  }

  function getTransport(e) {
    var urlField = document.getElementById("url");
    var outputField = document.getElementById("output");
    e.preventDefault();
    doCORSRequest(
      {
        method: "GET",
        url: urlField.value,
      },
      function printResult(result) {
        var from = result.search("busstop");
        var to = result.length;
        var newstr = result.substring(from, to);
        newstr = newstr.split('<div class="footer">')[0];
        newstr = newstr.split('</a><br><a href=prediction.php?');
        newstr = newstr.join();
        newstr = newstr.split('</a>')[0];
        newstr = newstr.split(',busstop=');
        newstr = newstr.join();
        newstr = newstr.split('busstop=')[1];
        newstr = newstr.replaceAll(">", ' ');
        newstr = newstr.split(',');

        outputField.value = newstr;
        console.log(newstr)
      }
    );
  }

  return (
    <div className="App">
      <h1>Проверка ответа от сервера</h1>
      <label>
        Введите URL:{" "}
        <input
          type="url"
          id="url"
          defaultValue="https://m.cdsvyatka.com/marsh_stops.php?marshlist=1001"
          size={500}
        />
      </label>
      <label>
        <button id="get" onClick={(e) => getTransport(e)}>
          GET
        </button>
      </label>
      <div id="bottom">
        <textarea id="output"></textarea>
      </div>
    </div>
  );
}

export default App;
