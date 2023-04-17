import "./App.css";
import React from "react";
import {default as logo} from "./front-of-bus.png";
import {default as sun} from "./sun-bright.png";
import {default as dark} from "./moon.png";

function App() {
  const autoVal = ["1001", "1002", "1003", "1005", "1008", "1009", "1010", "1011", "1012", "1014", "1015", "1016", "1019", "1020", "1021", "1022", "1023", "1026", "1033", "1038", "1039", "1044", "1046", "1047", "1050", "1051", "1052", "1053", "1054", "1061", "1067", "1070", "1074", "1084", "1087", "1090", "2046", "2053", "3101", "3104", "3106", "3107", "3108", "3109", "3112", "3115", "3116", "3117", "3121", "3125", "3127", "3129", "3130", "3133", "3136", "3138", "3143", "3146", "3147", "3148", "3154", "3155", "3158", "3160", "3168", "50010", "50030", "50040", "50050", "50070", "50080"];
  const autoDesc = ["Авт 1", "Авт 2", "Авт 3", "Авт 5", "Авт 8", "Авт 9", "Авт 10", "Авт 11", "Авт 12", "Авт 14", "Авт 15", "Авт 16", "Авт 19", "Авт 20", "Авт 21", "Авт 22", "Авт 23", "Авт 26", "Авт 33", "Авт 38", "Авт 39", "Авт 44", "Авт 46", "Авт 47", "Авт 50", "Авт 51", "Авт 52", "Авт 53", "Авт 54", "Авт 61", "Авт 67", "Авт 70", "Авт 74", "Авт 84", "Авт 87", "Авт 90", "Авт К46", "Авт К53", "Авт 101", "Авт 104", "Авт 106", "Авт 107", "Авт 108", "Авт 109", "Авт 112", "Авт 115", "Авт 116", "Авт 117", "Авт 121", "Авт 125", "Авт 127", "Авт 129", "Авт 130", "Авт 133", "Авт 136", "Авт 138", "Авт 143", "Авт 146", "Авт 147", "Авт 148", "Авт 154", "Авт 155", "Авт 158", "Авт 160", "Авт 168", "Тролл Т1", "Тролл Т3", "Тролл Т4", "Тролл Т5", "Тролл Т7", "Тролл Т8"];
  const [marshRes, setMarshRes] = React.useState([]);
  const [optVal, setOptVal] = React.useState("");
  const [mVal, setMVal] = React.useState("");
  const [view, setView] = React.useState(false);
  const [urlVal, setUrlVal] = React.useState("");
  const [au, setAu] = React.useState(0);
  var [arr, setArr] = React.useState([]);
  var [revArr, setRevArr] = React.useState(true);
  // var cors_api_url = "https://cors-anywhere.herokuapp.com/";
  // const [back, setBack] = React.useState(false);

  React.useEffect(() => {
    fetch("/db.json").then((resp) =>
      resp.json().then((json) => {
        setAu(json.elem);
      })
    );
  }, []);

  const onSetMarsh = () => {
    const select = document.getElementById("marshlist").getElementsByTagName("option");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selected) {
        setMVal(select[i].value);
        setArr(au[select[i].value]);
      }
    }
  }

  function onSetTS(e) {
    const select = document.getElementById("autolist").getElementsByTagName("option");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selected) {
        console.log("onSet1 = " + select[i].value);
        console.log("onSet2 = " + select[i].innerHTML);
        getInfo(e, select[i].value, select[i].innerHTML);
      }
    }
  }

  const onRevArr = () => {
    setRevArr(!revArr);
  }

  function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    // x.open(options.method, cors_api_url + options.url);
    x.open(options.method, options.url);
    x.onload = x.onerror = function () { printResult(x.responseText); }
    x.send(options.data);
  }

  const transport = () => {
    onSetMarsh();
    console.log(arr);
  }
  
  const reverseArr = () => {
    onRevArr();
    const v = document.getElementById('changeRoute').innerHTML;
    if (v === "Обратно") {
      document.getElementById('changeRoute').innerHTML = "Туда";
    } else {
      document.getElementById('changeRoute').innerHTML = "Обратно";
    }
  }

  function getTS(e) {
    onSetTS(e);
  }

  function getInfo(e, val, desc, url, descVal) {
    console.log("getInfo");
    // var urlField = "https://m.cdsvyatka.com/prediction.php?busstop=" + val;
    var urlField;
    if (url !== undefined) {
      urlField = url;
    } else {
      urlField = "http://localhost:8010/proxy/prediction.php?busstop=" + val;
      setUrlVal(urlField);
    }
    console.log(urlField);
    if (descVal !== undefined) {
      setOptVal(descVal);
    } else {
      setOptVal("Остановка: " + desc);
    }
    e.preventDefault();
    doCORSRequest({ method: "GET", url: urlField },
      function printResult(result) {
        var from = result.search("marshlist");
        var to = result.length;
        var newstr = result.substring(from, to);
        newstr = newstr.split('</table>')[0];
        newstr = newstr.split("&nbsp </td><td class=\"minutes\">");
        newstr = newstr.join();
        newstr = newstr.substring(">", newstr.length);
        newstr = newstr.split("</td><td>");
        newstr = newstr.join();
        newstr = newstr.split('&nbsp');
        for (var i = 0; i < newstr.length; i++) {
          newstr[i] = newstr[i].split('</a>')[0];
        }
        newstr = newstr.join();
        newstr = newstr.split(', , ,');
        for (var k = 0; k < newstr.length; k++) {
          newstr[k] = newstr[k].split('hlist')[1];
        }
        if (newstr.length > 0) {
          newstr.length--;
        }
        for (var t = 0; t < newstr.length; t++) {
          newstr[t] = newstr[t].split('>')[1];
          newstr[t] = newstr[t].replace(' ,  , ','');
          newstr[t] = newstr[t].split(',');
        }
        // console.log(newstr);
        setMarshRes(newstr);
        setView(true);
      }
    );
  }

  function changeTheme() {
    const v = document.getElementById("darkTheme").src;
    if (v === sun) {
      document.getElementById("darkTheme").src = dark;
      document.querySelector(".App").style.background = "white";
      document.querySelector(".darkTheme1").style.color = "rgb(26, 31, 37)";
      document.querySelector(".content").style.borderTop = "1px solid rgba(0, 0, 0, 0.1)";
      document.querySelector(".darkTheme2").style.color = "rgb(26, 31, 37)";
      document.querySelectorAll(".darkTheme3").forEach(function(elem){
        elem.style.color = "rgb(26, 31, 37)";
      })
    } else {
      document.getElementById("darkTheme").src = sun;
      document.querySelector(".App").style.background = "rgb(26, 31, 37)";
      document.querySelector(".darkTheme1").style.color = "rgba(255, 255, 255, 0.75)";
      document.querySelector(".content").style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
      document.querySelector(".darkTheme2").style.color = "rgba(255, 255, 255, 1)";
      document.querySelectorAll('.darkTheme3').forEach(function(elem){
        elem.style.color = "rgba(255, 255, 255, 0.75)";
      })
    }
  }

  return (
    <div className="App">
      <header>
        <img src={logo} alt="logo"/>
        <h1>ЦДС Вятка</h1>
        <img src={sun} alt="logo" id="darkTheme" onClick={() => changeTheme()}/>
      </header>
      <div className="content-header">
        <p className="darkTheme1">Поиск по маршруту</p>
        <select name="marshlist" id="marshlist" onChange={() => transport()} defaultValue="">
          <option></option>
          {autoDesc.map((v, i) => (
            <option key={i} value={autoVal[i]}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {mVal && (<div className="content-header">
        <div className="content-change">
          <select name="autolist" id="autolist" onChange={(e) => getTS(e)} defaultValue="">
            <option></option>
            {arr && revArr && arr.map((v,i) => {
              // console.log(v + " --- " + i + " --- " + arr.length);
              return (
                <option key={i} value={v.slice(0, v.indexOf(' '))}>
                  {v.slice(v.indexOf(' '), v.length)}
                </option>)})}
            {arr && !revArr && Array.from(arr).reverse().map((v,i) => {
              return (
                <option key={i} value={autoVal[i]}>
                  {v.slice(v.indexOf(' '), v.length)}
                </option>)})}
          </select>
          <button onClick={() => reverseArr()} id="changeRoute">Обратно</button>
        </div>
      </div>)}
      <div className="content">
        <h3 className="darkTheme2">{optVal}</h3>
        <table>
        {view && (<tr className="table"><th>Маршрут</th><th>Ожидание</th><th>Следующая</th></tr>)}
        {view && marshRes.map((v,i) => (
          <tr key={i}>
            <td className="darkTheme3">{v[0]}</td>
            <td className="darkTheme3">{v[1]}</td>
            <td className="darkTheme3">{v[2]}</td>
          </tr>
        ))}
        </table>
        {view && (<button onClick={(e) => getInfo(e, "", "", urlVal, optVal)}>Обновить</button>)}
        {/* {back && (<button onClick={() => setBack(true)}>Назад</button>)} */}
      </div>
      <a href="https://cors-anywhere.herokuapp.com/corsdemo" className="notWorking">Если не работает</a>
    </div>
  );
}

export default App;
