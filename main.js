    const allowedSymbols = " абвгдежзийклмнопрстуфхцчшщьыъэюя";
    const container = document.getElementsByClassName("inputContainer")[0];
    const buttonContainer = document.getElementsByClassName("buttonsContainer")[0];
    const graphicsContainer = document.getElementsByClassName("graphicsContainer")[0];
    const statDisplaysContainer = document.getElementsByClassName("statDisplaysContainer")[0];
    const statCPM = document.getElementsByClassName("statCPM")[0];
    const statAccuracy = document.getElementsByClassName("statAccuracy")[0];
    
    const russianLetters = "абвгдежзийклмнопрстуфхцчшщьыъэюя";

    var array = [];
    var isLoaded = false;
    var currentLetterIndex = 0;
    var rightCounter = 0;
    
    var needToRecordStats = false;
    var lettersCounter = [];
    var mistakesCounter = [];

    document.addEventListener("DOMContentLoaded", function(){
        HttpGetAsync("https://muzhevsky.github.io/russian_dictionary/", GetWordsCallback);
        

        for(let i = 0; i < russianLetters.length; i++){
            lettersCounter.push(0);
            mistakesCounter.push(0);
        }

        GenerateButtons();

        let time = 0;
        let delayArray = [];

        document.addEventListener("keydown",function(e){
            if(isLoaded){
                if(currentLetterIndex >= container.children.length-1) return;
                
                if(!allowedSymbols.includes(e.key)) return;
                
                var currentSpan = container.children[currentLetterIndex];
                    
                let currentLetterPosition = GetElementNumberInArray(currentSpan.innerHTML[0],russianLetters);
                lettersCounter[currentLetterPosition]++;

                if(e.key == currentSpan.innerHTML[0]){
                    currentSpan.style.backgroundColor = "green";
                    currentLetterIndex++;
                    rightCounter++;

                }
    
                else{
                    currentSpan.style.backgroundColor = "red";
                    currentLetterIndex++;
                    mistakesCounter[currentLetterPosition]++;
                }
                
                let rightNumber = lettersCounter[currentLetterPosition]-mistakesCounter[currentLetterPosition];
                graphicsContainer.children[currentLetterPosition].children[0].style.height = String(100*rightNumber/lettersCounter[currentLetterPosition])+"%";
                statDisplaysContainer.children[currentLetterPosition].innerHTML = rightNumber + "/" + lettersCounter[currentLetterPosition];

                if (time == 0){
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
            }
        });
    });

    function GenerateButtons(){
        let letters = "абвгдежзийклмнопрстуфхцчшщьыъэюя";
        letters = Array.from(letters);
        letters.forEach(function(element){
            buttonContainer.innerHTML+="<span class = 'letterButton'>"+element+"</span>";
        });
        let buttons = Array.from(document.getElementsByClassName("letterButton"));
        
        buttons.forEach(function(element){
            element.addEventListener("click", function() {
                let words = GetWordsWithCurrentLetter(element.textContent);
                PushWordsIntoContainer(words);
            });
        });

        for(let i = 0; i < letters.length; i++){
            graphicsContainer.innerHTML += "<div class = 'graphicBackground'><div class = 'graphicFill'></div></div>"
        }

        for(let i = 0; i < letters.length; i++){
            statDisplaysContainer.innerHTML += "<div class = 'statsDisplay'>0/0</div>"
        }
    }
    function isAWord(string){
        return (string.length > 5 && string.length < 12);
    }
    
    function GetWordsCallback(a){
        string = a.slice(a.indexOf("<body>")+6, a.indexOf("</body>"));
        array = string.split("\n");
        array = array.filter(isAWord);
        if (array.length > 0){
            isLoaded = true;
            PushWordsIntoContainer(GetWordsWithCurrentLetter("а"));
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
    
    function GetWordsWithCurrentLetter(currentLetter){
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
                            result.push(array[j]);
    
                        break;
                    }
                }
            }
        }
        return result;
    }
    
    function PushWordsIntoContainer(words){
        currentLetterIndex = 0;
        rightCounter = 0;
        container.innerHTML = "";
        words.forEach(function(item){
            for(let i = 0; i < item.length; i++){
                container.innerHTML+="<span>"+item[i]+"</span>";
            }
            container.innerHTML+="<span> </span>";
        });
        isLoaded = true;
    }

    function GetElementNumberInArray(element, array){
        result = 0;
        if(!Array.isArray(array)) 
            array = Array.from(array);
        
        for(result; result < array.length; result++)
            if(array[result] == element) 
                return result;
        
        result = -1;
        return -1;
    }