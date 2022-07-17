
    var array = [];
    var isLoaded = false;
    var currentLetter = "а";
    var currentLetterIndex = 0;
    var rightCounter = 0;
    
    var container = document.getElementsByClassName("inputContainer")[0];
    var statCPM = document.getElementsByClassName("statCPM")[0];
    var statAccuracy = document.getElementsByClassName("statAccuracy")[0];
    
    document.addEventListener("DOMContentLoaded", HttpGetAsync("https://muzhevsky.github.io/russian_dictionary/", GetWordsCallback));

    function isAWord(string){
        return (string.length > 5 && string.length < 12);
    }
    
    function GetWordsCallback(a){
        string = a.slice(a.indexOf("<body>")+6, a.indexOf("</body>"));
        array = string.split("\n");
        array = array.filter(isAWord);
        if (array.length > 0){
            isLoaded = true;
            PushWordsIntoContainer(GetWordsWithCurrentLetter());
        } 
    
        else HttpGetAsync("https://muzhevsky.github.io/russian_dictionary/", GetWordsCallback);
    }
    
    function HttpGetAsync(theUrl, callback)
    {
        let xmlHttp = new XMLHttpRequest();
    
        xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
                GetWordsCallback(xmlHttp.responseText);
        }
    
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
    }
    
    let test = "asd";
    
    function GetWordsWithCurrentLetter(){
        result = [];
        for(let i = 0; i < 20; i++){
    
    
            let randPos = Math.round(Math.random()*array.length);
            let length = result.length;
    
            while(length == result.length){
                for(let j = randPos; j < array.length; j++){
                    if(array[j].includes(currentLetter)){
    
                        if(array[j][array[j].length-1]=="\n") 
                            result.push(array[j].slice(0,array[j].length));
    
                        else 
                            result.push(array[j].slice(0,array[j].length));
    
                        break;
                    }
                }
            }
        }
        return result;
    }
    
    function PushWordsIntoContainer(words){
        let time = 0;
        let delayArray = [];
        words.forEach(function(item){
            for(let i = 0; i < item.length; i++){
                container.innerHTML+="<span>"+item[i]+"</span>";
            }
            container.innerHTML+="<span> </span>";
        });
        
        document.addEventListener("keydown",function(e){
    
            if(currentLetterIndex >= container.children.length-1) return;
    
            if(e.code == "ControlLeft" || e.code == "ShiftLeft" || e.code == "AltLeft" || e.code == "CapsLock") return;
    
            if(e.key == container.children[currentLetterIndex].innerHTML[0]){
                container.children[currentLetterIndex].style.backgroundColor = "green";
                currentLetterIndex++;
                rightCounter++;
            }
            else{
                container.children[currentLetterIndex].style.backgroundColor = "red";
                currentLetterIndex++;
            }
            
            if(time == 0){
                time = performance.now();
            }
            else{
                delayArray.push(performance.now() - time);
                time = performance.now();
    
                let sum = 0;
                let average = 0;
    
                for(let i = 0; i < delayArray.length; i++) 
                    sum+=delayArray[i];
                average = sum/delayArray.length;
    
                statCPM.innerHTML = Math.round(60000/average);
                statAccuracy.innerHTML = Math.round(rightCounter/currentLetterIndex*100);
            }
        });
    }