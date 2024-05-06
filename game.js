//setting the game name
let game_name = "Guess The Word";
document.title = game_name;
let header = document.querySelector(".game-name");
header.innerHTML = game_name;

//////////////////////////////////setting the game-area/////////////////////////////////
let game_space = document.querySelector(".left-side");
let num_of_trials = 5;
let num_of_letters = 6;
let current_try = 1;
let num_of_hints = 2;
let guessed_words = [
  "magico",
  "action",
  "younis",
  "doctor",
  "dollar",
  "domain",
];
let word = guessed_words[Math.floor(Math.random() * 6)];
console.log(word);
let right_and_inplace_color = getComputedStyle(
  document.documentElement
).getPropertyValue("--right-and-inplace-color");
let right_but_NotInplace_color = getComputedStyle(
  document.documentElement
).getPropertyValue("--right-but-NotInplace-color");
let wrong_color = getComputedStyle(document.documentElement).getPropertyValue(
  "--wrong-color"
);
function create_inputs() {
  for (let i = 1; i <= num_of_trials; i++) {
    let tiral = document.createElement("div");
    tiral.classList.add("try");
    tiral.classList.add(`t${i}`);
    //try number
    let try_number = document.createElement("span");
    try_number.classList.add("try-number");
    try_number.innerHTML = `Try${i}`;
    tiral.appendChild(try_number);
    //creating input fields
    for (let j = 1; j <= num_of_letters; j++) {
      let letter = document.createElement("input");
      letter.classList.add(`letter`, `t${i}-letter`);
      letter.id = `let${j}`;

      let type = document.createAttribute("type");
      type.value = "text";

      let maxLength = document.createAttribute("maxlength");
      maxLength.value = "1";

      letter.setAttributeNode(type);
      letter.setAttributeNode(maxLength);
      tiral.appendChild(letter);
    }
    let word_letters = game_space.append(tiral);
  }
}
function disable_all_trials() {
  let all_trials = document.querySelectorAll(".try");
  all_trials.forEach((e) => {
    e.classList.remove("active");
    e.classList.add("disable");
    e.disabled = true;
  });
  let active_inputs = document.querySelectorAll(`.letter`);
  active_inputs.forEach((e) => {
    e.disabled = true;
    e.classList.remove("active");
  });
}
//onload the window
window.onload = create_inputs();
function active_inputs(trial_num) {
  //disable all trials
  disable_all_trials();
  let inputs = document.querySelectorAll(".letter");
  inputs.forEach((e) => (e.disabled = true));
  //make the current try active
  let active_trial = document.querySelector(`.t${trial_num}`);
  active_trial.classList.add("active");
  active_trial.classList.remove("disable");
  active_trial.disabled = false;
  // make the current trial inputs active
  let active_inputs = document.querySelectorAll(`.t${trial_num}-letter`);
  active_inputs.forEach((e) => {
    e.disabled = false;
    e.classList.add("active");
  });
  document.querySelector(`.t${trial_num}-letter#let1`).focus();
}
/////////////// Control the input fields /////////
active_inputs(current_try);
let all_inputs = document.querySelectorAll("input");
all_inputs.forEach((e, index) => {
  e.addEventListener("input", function () {
    this.value = this.value.toLowerCase();
    const next_input = all_inputs[index + 1];
    // automatic focus on the next input
    if (next_input && next_input.classList.contains("active")) {
      next_input.focus();
    }
  });
  ///////////// Adding key-controlls to [left - right] ///////
  e.addEventListener("keydown", function (event) {
    const current_index = Array.from(all_inputs).indexOf(this);
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      const next_index = current_index + 1;
      if (next_index % num_of_letters < num_of_letters) {
        all_inputs[next_index].focus();
      }
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      const prev_index = current_index - 1;
      if (prev_index >= 0) {
        all_inputs[prev_index].focus();
      }
    } else if (event.key === "Backspace") {
      const prev_index = current_index - 1;
      if (prev_index >= 0) {
        all_inputs[prev_index].value = "";
        all_inputs[prev_index].focus();
      }
    } else if (event.key === "Enter") {
      check_btn.click();
    }
  });
});
///////////////////////////////////////////////////////////////

/////////////////////// Check The Word ///////////////////////
let game_area = document.querySelector(".game-area");
const check_btn = document.querySelector(".check-btn");
const hints_btn = document.querySelector(".hints-btn");
const game_desc_btn = document.querySelector(".desc-btn");

function disable_btns() {
  check_btn.disabled = true;
  hints_btn.disabled = true;
  game_desc_btn.disabled = true;
}

let result_message = document.querySelector(".check-result");
let unique_letters = word.split("");
check_btn.addEventListener("click", function () {
  let hit = 0;
  let success = false;
  if (current_try <= num_of_trials) {
    for (let i = 0; i < num_of_letters; i++) {
      let inp = document.querySelector(`#let${i + 1}.t${current_try}-letter`);
      if (inp.value != "") {
        // the letter is right and in its place
        if (inp.value === word[i]) {
          unique_letters[word.indexOf(inp.value)] = "";
          inp.classList.add("right-and-inplace");
          success = true;
          hit++;
        }
        // the letter is right but not in the right place
        else if (word.includes(inp.value)) {
          inp.classList.add("right-but-not_inplace");
          success = false;
        }
        // the letter is not right
        else {
          inp.classList.add("wrong-letter");
          success = false;
        }
      }
    }
    ///////////////////////////// The Guess Result ////////////////////////////
    let result_popup = document.querySelector(".result-pop-up");
    function popup_result_window() {
      let close = document.querySelector(".popup-btns .close");
      let play_again = document.querySelector(".popup-btns .play-again");
      result_popup.classList.remove("hide");
      game_area.classList.add("half-opacity");
      pop_up(close, result_popup);
      play_again.addEventListener("click", () => {
        location.reload();
      });
    }
    /////// player win
    if (hit === word.length) {
      result_message.classList.add("winner");
      result_message.innerHTML = `Congratulations! You Won <br> The Word Is <span>${word.toUpperCase()}</span>`;
      document.querySelector(".popup-result-area").appendChild(result_message);
      let all_divs = document.querySelectorAll(".try");
      all_divs.forEach((e) => (e.disabled = true));
      disable_btns();
      disable_all_trials();
      //popup result window
      let popup_title = document.querySelector(".popup-title");
      popup_title.innerText = "WINNER";
      popup_result_window();
    }
    /////// player lose
    else {
      current_try++;
      current_try <= num_of_trials ? active_inputs(current_try) : false;
      if (current_try > num_of_trials && !success) {
        result_message.classList.add("winner");
        result_message.innerHTML = `BAD-LOOSER! <br> The Word Is <span>${word.toUpperCase()}</span>`;
        document
          .querySelector(".popup-result-area")
          .appendChild(result_message);
        disable_btns();
        disable_all_trials();
        //popup result window
        let popup_title = document.querySelector(".popup-title");
        popup_title.innerText = "LOSER";
        popup_result_window();
      }
    }
  }
});
/////////////////////////////// Hints handling /////////////////////////////
hints_btn.innerHTML = `${num_of_hints} Hints`;
hints_btn.addEventListener("click", function () {
  let found = false;
  if (num_of_hints > 0) {
    for (let i = 0; i < 6; i++) {
      let hint_input = document.querySelector(`#let${i + 1}.active`);
      if (hint_input.value === "") {
        hint_input.value = word[i];
        hint_input.focus();
        num_of_hints--;
        hints_btn.innerHTML = `${num_of_hints} Hints`;
        found = true;
        break;
      }
    }
  }
});

/////////// Handle Game discription btn in mobile mode /////////////////////
let game_popup = document.querySelector(".game-pop-up");
function pop_up(exit, hide_element) {
  exit.addEventListener("click", function () {
    hide_element.classList.add("hide");
    game_area.classList.remove("half-opacity");
  });
}
game_desc_btn.addEventListener("click", function () {
  game_popup.classList.remove("hide");
  game_area.classList.add("half-opacity");
  disable_btns();
  let exit = document.querySelector(".game-pop-up .exit");
  pop_up(exit, game_popup);
  exit.addEventListener("click", () => {
    check_btn.disabled = false;
    hints_btn.disabled = false;
    game_desc_btn.disabled = false;
  });
});
