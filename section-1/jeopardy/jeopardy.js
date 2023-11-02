
function hasNoDuplicates(arr) {
    return arr.every(function(val) {
        return arr.indexOf(val) === arr.lastIndexOf(val); 
    });
}


let NUM_CATEGORIES = [];
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
function getCategoryIds() { 
    
    while (NUM_CATEGORIES.length < 6) {
        const catId = [
            209,
            1892,
            4483,
            88,
            218,
            1072,
            881,
            7355,
            574,
            16,
            3336,
            6224,
            14701,
            388,
            7347,
            380,
            411,
            1147,
            1686,
            2760,
            1808,
            651,
            726,
            1404,
            3333,
            1150,
            1140,
            2350,
            538, 
            863,
            530,
            50,
            809,
            7740

        ];
        let random = Math.floor(Math.random() * catId.length);
        NUM_CATEGORIES.push(catId[random]);
        if (!hasNoDuplicates(NUM_CATEGORIES)) {
            NUM_CATEGORIES = [];
            getCategoryIds();
        }
    }
    return NUM_CATEGORIES;
    
 }

    
    
/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    function shuffle(catId) {
        var j, x, i;
        for (i = catId.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            x =catId[i];
            catId[i] = catId[j];
            catId[j] = x;
        }
        return catId;
    };
    

     const response = await axios.get(`https://jservice.io/api/category?id=${catId}`);
    console.log(response.data);

    

    let questions = response.data.clues;
    let fiveClues = shuffle(questions).slice(0,5);
    let arrClue = fiveClues.map((result) => {
        return {question: result.question , answer: result.answer};
    });
    let categoryData = {title: response.data.title, clues: arrClue};
    return categoryData;

}

const WIDTH = 6;
const HEIGHT = 5;

let board = [];

function makeBoard() {
    for(let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({length: WIDTH}));
    }

}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable(category) {
    const $gameBoard = $('<table id="jepordardy"></table>');
    $('body').append($gameBoard);
    let $top = $('<tr id="categories"></tr>');
    $($gameBoard).append($top);
    let catData = [];
    const categoryNums =  getCategoryIds();

    for(let category of categoryNums) {
        catData.push(await getCategory(category));
    }

    for(let x =0; x < WIDTH; x++) {
        let $headCell = $('<th></th>');
        $headCell.attr('id', x);
        $headCell.html(catData[x].title);
        $top.append($headCell);
    }
    $gameBoard.append($top);

    for(let y = 0; y < HEIGHT; y++) {
        const $row = $('<tr></tr>'); 
        
        for(let x = 0; x < WIDTH; x++) {
            let $cell = $('<td></td>');
            $cell.html('?');
            $cell.attr('id', `${y}-${x}`);
            $row.append($cell);
           ($cell).on('click', function(evt){
                for (let y =0; y < HEIGHT; y++){
                    for (let x = 0; x < WIDTH; x++) {
                        if (evt.target.id === `${y} -${x}`) {
                            if ($(evt.target).html() !== '?'){
                                $(evt.target).html(`${catData[x].clues[y].answer}`);
                            } else {
                                $(evt.target).html(`${catData[x].clues[y].question}`);
                            }
                        }
                    }
                }
            });
        }
        $gameBoard.append($row);
    }
}
    fillTable();


    



    



/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    const id = evt.target.id;
    const [catId, clueId] = id.split("-");

    const category = catId;

    if (category && category.clues[clueId]);
    let msg;

    if (!clueId.showing) {
    msg = clue.question;
    clue.showing = "question";
    } else if (clue.showing === "question") {
        msg = clue.answer;
        clue.showing = "answer";
        $(`${catId} - ${clueId}`).addClass("revealed");
    }else {
        return;
    }
    $(`#${catId} - ${clueId}`).html(msg);
    

  

}
    
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    const spinner = document.createElement("div");
    spinner.addClass('loadingSpinner');
    spinner.style.display ="block";
    $('#restart').on('click', function() {
        $('#jeopardy').remove();
        fillTable();
    });

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    const spinner = document.getElementsByClassName('loadingSpinner');
    spinner.style.display = "none";
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    let $startBtn = document.createElement('button');
    $startBtn.innerHTML = ('Start');
    $('body').append($startBtn);
    $($startBtn).on('click', function(e) {
        showLoadingView();
        getCategoryIds();
        getCategory();
        fillTable();
    });

}
setupAndStart();
 
 
