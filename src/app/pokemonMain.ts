import { Component } from '@angular/core';
import Keyboard from "simple-keyboard";

const attempts = 6; 
let guessesRemain = attempts; 
let currentAttempt: string[] = []; 
let next = 0; 

@Component({
  selector: 'app-root',
  templateUrl: './pokemonSkeleton.html',
  styleUrls: ['./pokemonStyleSheets.css']
})

export class AppComponent {
  value = ""; 
  keyboard!: Keyboard; 
  title = 'wordle-clone';
  pokemon!: String; 
  pokemonhint1!:string;
  pokemonhint2!:string;
  pokemonhint3!:string;
  pokemonhint4!: string;
  
  constructor(){ 
    this.getPokemon(); 
  } 

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };
  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

getRandom(){ 
  return Math.floor(Math.random() * (300 - 1) + 1);
}

deleteLetter(){ 
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemain];
  let box = row.children[next - 1];
  box.textContent = ""; 
  box.classList.remove("filled-box")
  currentAttempt.pop(); 
  next--; 
}

checkPokemon() {
  const row = document.getElementsByClassName("letter-row")[6 - guessesRemain];
  const guessString = currentAttempt.join('');

  if (guessString.length !== this.pokemon.length) {
    console.log("Not enough letters!"); // Display a message to the user instead of using alert
    return;
  }

  if (guessString === this.pokemon) {
    console.log("Correct"); // Display a message to the user instead of using alert
  } else {
    guessesRemain--;

    if (guessesRemain === 0) {
      console.log(`You're out of attempts, the pokemon was: ${this.pokemon}`);
      window.location.reload // Display a message to the user instead of using alert
    } else {
      currentAttempt = [];
      next = 0;
    }
  }
}

insertletter(userKey: string){ 
  if (next === this.pokemon.length){
    return; 
  }
   
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemain]
  let box = row.children[next]; 
  box.textContent = userKey; 
  box.classList.add("filled-box"); 
  currentAttempt.push(userKey); 
  next += 1; 
}

async getTheHint() {
  try {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${this.pokemon}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (guessesRemain <= 5) {
      this.pokemonhint1 = data.types[0].type.name;
    }

    if (guessesRemain <= 4) {
      this.pokemonhint4 = data.sprites["front_default"];
    }
  } catch (error) {
    console.error("Error fetching Pokemon hint:", error);
  }
}

getPokemon(){ 
  const data = {
    URL: "https://pokeapi.co/api/v2/pokemon/",
    id: this.getRandom()
  }; 
  console.log(this.getRandom()); 
  const { URL, id } = data;
  const api_URL = `${URL}${id}`;
  fetch(api_URL)
    .then((data) => data.json())
    .then((poke) => genHTML(poke));

  const genHTML = (data: any) => {
    this.pokemon = `${data.name}`;
    this.pokemon = this.pokemon.trim()

    this.initGameBoard(); 
    this.initKeyboard(); 
    
};
}

initGameBoard(){ 
  let board = document.getElementById("game-board");
  for(let i =0; i < attempts; i++){
    let row = document.createElement("div")
    row.className = "letter-row"

    for(let j = 0; j < this.pokemon.length; j++){
      let box = document.createElement("div")
      box.className = "letter-box"
      row.appendChild(box)
    }
    board?.appendChild(row)
  }
}

  initKeyboard(){
  document.addEventListener("keyup", (e) =>{
    let userKey = String(e.key)
    if(userKey === "Backspace" && next != 0){
      this.deleteLetter(); 
      return; 
    }
    if(userKey === "Enter"){ 
      this.checkPokemon(); 
      return; 
    }
    let correct = userKey.match(/[a-z-]/gi)
    if(!correct || correct.length > 1){
      return 
    } else{ 
      this.insertletter(userKey); 
    } 
  })
}
}


