import "./App.css";
import React from "react";

function App() {
  const autoVal = ["1001", "1002", "1003", "1005", "1008", "1009", "1010", "1011", "1012", "1014", "1015", "1016", "1019", "1020", "1021", "1022", "1023", "1026", "1033", "1038", "1039", "1044", "1046", "1047", "1050", "1051", "1052", "1053", "1054", "1061", "1067", "1070", "1074", "1084", "1087", "1090", "2046", "2053", "3101", "3104", "3106", "3107", "3108", "3109", "3112", "3115", "3116", "3117", "3121", "3125", "3127", "3129", "3130", "3133", "3136", "3138", "3143", "3146", "3147", "3148", "3154", "3155", "3158", "3160", "3168", "50010", "50030", "50040", "50050", "50070", "50080"];
  const autoDesc = ["Авт 1", "Авт 2", "Авт 3", "Авт 5", "Авт 8", "Авт 9", "Авт 10", "Авт 11", "Авт 12", "Авт 14", "Авт 15", "Авт 16", "Авт 19", "Авт 20", "Авт 21", "Авт 22", "Авт 23", "Авт 26", "Авт 33", "Авт 38", "Авт 39", "Авт 44", "Авт 46", "Авт 47", "Авт 50", "Авт 51", "Авт 52", "Авт 53", "Авт 54", "Авт 61", "Авт 67", "Авт 70", "Авт 74", "Авт 84", "Авт 87", "Авт 90", "Авт К46", "Авт К53", "Авт 101", "Авт 104", "Авт 106", "Авт 107", "Авт 108", "Авт 109", "Авт 112", "Авт 115", "Авт 116", "Авт 117", "Авт 121", "Авт 125", "Авт 127", "Авт 129", "Авт 130", "Авт 133", "Авт 136", "Авт 138", "Авт 143", "Авт 146", "Авт 147", "Авт 148", "Авт 154", "Авт 155", "Авт 158", "Авт 160", "Авт 168", "Тролл Т1", "Тролл Т3", "Тролл Т4", "Тролл Т5", "Тролл Т7", "Тролл Т8"];
  const [marshRes, setMarshRes] = React.useState([]);
  const [optVal, setOptVal] = React.useState("");
  var cors_api_url = "https://cors-anywhere.herokuapp.com/";
  var mVal = 0, mHtml = "";

  function onSetMarsh() {
    const select = document.getElementById("marshlist").getElementsByTagName("option");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selected) {
        mHtml = select[i].innerHTML; mVal = select[i].value;
      }
    }
  }

  function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    // x.open(options.method, options.url);
    x.onload = x.onerror = function () { printResult(x.responseText); }
    x.send(options.data);
  }

  function getTransport(e) {
    onSetMarsh();
    var urlField = "https://m.cdsvyatka.com/marsh_stops.php?marshlist=" + mVal;
    // var urlField = "http://localhost:8010/proxy/marsh_stops.php?marshlist=" + mVal;
    console.log(urlField);
    setOptVal("Остановки на маршруте - " + mHtml);
    e.preventDefault();
    doCORSRequest({ method: "GET", url: urlField },
      function printResult(result) {
        var from = result.search("busstop");
        var to = result.length;
        var newstr = result.substring(from, to);
        newstr = newstr.split('<div class="footer">')[0];
        newstr = newstr.split("</a><br><a href=prediction.php?");
        newstr = newstr.join();
        newstr = newstr.split("</a>")[0];
        newstr = newstr.split(",busstop=");
        newstr = newstr.join();
        newstr = newstr.split("busstop=")[1];
        newstr = newstr.replaceAll(">", " ");
        newstr = newstr.split(",");
        setMarshRes(newstr);
        console.log(marshRes);
      }
    );
  }

  function getInfo(e, val, desc) {
    mVal = val;
    var urlField = "https://m.cdsvyatka.com/prediction.php?busstop=" + mVal;
    // var urlField = "http://localhost:8010/proxy/prediction.php?busstop=" + mVal;
    console.log(urlField);
    setOptVal("Остановка - " + desc);
    e.preventDefault();
    doCORSRequest({ method: "GET", url: urlField },
      function printResult(result) {
        var newstr = result;
        newstr = [];
        setMarshRes(newstr);
        console.log(marshRes);
      }
    );
  }

  return (
    <div className="App">
      <header>
        <h1>ЦДС Вятка</h1>
      </header>
      <div className="content-header">
        <p>Поиск по маршруту</p>
        <select name="marshlist" id="marshlist">
          {autoDesc.map((v, i) => (
            <option key={i} value={autoVal[i]}>
              {v}
            </option>
          ))}
        </select>
        <button onClick={(e) => getTransport(e)}>
            Найти
        </button>
      </div>
      <div className="content">
        <h3>{optVal}</h3>
        <ul>
        {marshRes.map((v,i) => (
          <li key={i} value={v.slice(0, v.indexOf(' '))} onClick={(e) => getInfo(e, v.slice(0, v.indexOf(' ')), v.slice(v.indexOf(' '), v.length))}>{v.slice(v.indexOf(' '), v.length)}</li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
