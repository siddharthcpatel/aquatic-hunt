// Siddharth Patel 100886586
// Hidden Objects Game

window.onload = function () {

    // Reference the puzzle
    let puzzle = document.querySelectorAll(".puzzleStyle");
    let puzzleButtons = document.querySelectorAll(".playButton");

    // Variables
    let thePuzzle = [];
    let theButton = [];
    let hiddenArray = [];
    let theObjects = [];
    let theMatching = [];
    let matchCount = 0;
    let matchFlag = false;
    let scoreValue = 0;
    let factsTimeout;
    const multiplier = 1;


    let sectID = ".sect";
    let theIndex = 0;

    let factText = document.querySelector(".factText");
    let factBox = document.querySelector(".fact");
    factText.innerHTML = '';

    let sects = document.querySelector(".sect1");

    factBox.style.top = `${sects.offsetHeight - (factBox.offsetHeight * 2)}px`;

    let mainElement = document.querySelector("main");
    let winScreen = document.querySelector(".winScreen");

    // Code for media query to make boardCenter stick to bottom
    let boardCenterElement = document.querySelector(".boardCenter");

    // Array to store completed levels
    let completedArray = [];

    if (window.matchMedia("(min-width: 856px)").matches) {
        boardCenterElement.style.top = "0px";
    } else {
        boardCenterElement.style.top = `${sects.offsetHeight}px`;
    }

    let timerBox = document.querySelector("#timer");

    // Initiate timer
    let duration = 0;
    let timerInterval;

    // Get timeout screen
    const timeoutScreen = document.querySelector(".timeoutScreen");

    const timer = (seconds) => {
        duration = seconds;

        timerInterval = setInterval(() => {

            if (duration < 0) {

                // Action when time is up
                clearInterval(timerInterval);

                menuAnimate.restart();
                gsap.to(factBox, { autoAlpha: 0 });

                setTimeout(() => {
                    menuAnimate.pause();
                }, 750);

                setTimeout(() => {
                    timeoutScreen.style.display = "flex";
                }, 1000);
            } else {

                // Display time
                timerBox.innerHTML = `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(duration-- % 60).padStart(2, '0')}`;
            }
        }, 1000) // Refreshes every second
    };

    // Functions to control timer
    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    const startTimer = (time) => {
        timer(time);
    };

    // Set up timeline
    let gBtimeline = gsap.timeline();
    let menuAnimate = gsap.timeline();
    let introTimeline = gsap.timeline();

    // Show and hide intro
    introTimeline.fromTo('.intro', {
        opacity: 1
    }, {
        opacity: 0,
        duration: 1,
        delay: 1
    }).fromTo('.sect', {
        opacity: 0
    }, {
        opacity: 1,
        duration: 2,
    });

    // Confetti Animation
    const confettiTimeline = gsap.timeline({ paused: true });
    const confettiCount = 100;

    function createConfetti() {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        document.body.appendChild(confetti);

        // Randomize confetti color, size, and rotation
        const colors = ["#FF5A5A", "#B2D783", "#0E8BFF", "#FFE040"]; // Add more colors as needed
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = randomColor;
        confetti.style.width = `10px`;
        confetti.style.height = `10px`;
        confetti.style.top = `-10px`;

        confettiTimeline.to(confetti, {
            duration: 5,
            x: Math.random() * (500 - -500) + -500,
            y: Math.random() * 500,
            ease: "cubic-bezier(0,.99,.5,1)",
            onComplete: () => {
                confettiTimeline.to(confetti, {
                    duration: 2,
                    opacity: 0
                });
                gsap.to(confetti, {
                    opacity: 0,
                    duration: 2
                })
            },
        }, 1);
    }

    for (let i = 0; i < confettiCount; i++) {
        createConfetti();
    }

    // Initialize click event for each puzzle
    for (let i = 0; i < puzzle.length; i++) {
        const theID = 'obj' + i;
        const theButtonID = 'objbtn' + i;
        thePuzzle[i] = document.getElementById(theID).contentDocument;
        theButton[i] = document.getElementById(theButtonID)
        theButton[i].addEventListener("click", function () {

            // Hide the main menu and reveal the proper section
            theIndex = i + 1; // theIndex is the selected puzzle
            sectID = ".sect" + theIndex
            const sceneID = 'scene' + theIndex;
            const objs = document.getElementById(sceneID).contentDocument;
            const theObjs = objs.querySelectorAll(".itemStyle");
            hiddenArray = [];
            theObjects = [];

            // Reset facts text
            factText.innerHTML = '';

            startTimer(60); // Timer for 60 seconds

            if (theIndex == 1) {
                theObjects = gsap.utils.toArray(theObjs);
            } else {
                theObjects = gsap.utils.toArray(theObjs).reverse();
            }

            theObjects.forEach(function (obj, index) {
                hiddenArray[index] = './images/puzzle' + theIndex + '/elem' + index + '.svg';
                obj.img = hiddenArray[index];
                let animation = gsap.timeline({ paused: true });
                animation.fromTo(obj, {
                    opacity: 1,
                }, {
                    autoAlpha: 0,
                    duration: .4,
                });
                obj.animation = animation;
                obj.addEventListener("click", checkMatch);
            });

            menuAnimate = gsap.timeline({ paused: true });
            menuAnimate.to([sectID, '.board'], { autoAlpha: 0, duration: .5 })
                .to('.sect', {
                    autoAlpha: 1,
                    display: "flex",
                    delay: .5
                })
                .to(theObjects, { autoAlpha: 1 })
                .to('.boardStyle', { opacity: 1 });

            shuffleRoutine();

            gBtimeline.to('.sect', {
                autoAlpha: 0,
                display: "none",
            })
                .to([sectID, '.board'], { autoAlpha: 1 })
                .fromTo('.board > div', {
                    y: -100
                }, {
                    y: 0,
                    stagger: .2
                })
                .fromTo('.itemsDisplay > img', {
                    opacity: 0,
                }, {
                    opacity: 1,
                    stagger: .2,
                });
        })
    }

    function shuffleRoutine() {
        theMatching = [];
        matchCount = 0;
        if (hiddenArray.length === 0) {
            menuAnimate.restart();
        } else {
            // Clone the array
            const clonedArray = hiddenArray.slice();

            // Shuffle the cloned array
            const shuffledArray = clonedArray.sort(() => Math.random() - 0.5);

            // Select the first 5 elements
            const selectedElements = shuffledArray.slice(0, 5);

            // Update theMatching and item elements
            for (let i = 0; i < 5; i++) {
                theMatching[i] = selectedElements[i];
                const itemID = 'item' + i;
                const selectedItem = selectedElements[i];
                document.getElementById(itemID).src = selectedItem;
            }
        }
    }

    function checkMatch() {

        matchFlag = false;
        for (let j = 0; j < 5; j++) {
            if (this.img === theMatching[j]) {
                matchFlag = true;
                matchCount += 1;
                scoreValue += multiplier;
                document.getElementById("score").innerHTML = scoreValue;
                document.getElementById("scoreMain").innerHTML = scoreValue;
                const theItem = '#item' + j;
                gsap.to(theItem, {
                    opacity: 0
                });
                this.animation.restart();

                // Clear previous times in timer
                clearTimeout(factsTimeout);

                // Code to display facts
                let elemIndex = this.img.indexOf("elem") + 4;
                let svgIndex = this.img.indexOf(".svg");
                let referenceID = this.img.substring(elemIndex, svgIndex);
                factText.innerHTML = factsObject[theIndex][referenceID];
                gsap.to(factBox, { autoAlpha: 1 })


                // Hide factBox after 5 seconds
                factsTimeout = setTimeout(() => {
                    gsap.to(factBox, { autoAlpha: 0 });
                }, 5000);
            };
        }

        // Get encouragement screen and button
        let encouragementScreen = document.querySelector(".encouragementScreen");
        let encouragementButton = document.querySelector("#continueMenuAnimation");

        // Complete a level
        if (matchCount === 5) {
            stopTimer()
            matchCount = 0;

            // Win
            if (scoreValue == 20) {
                setTimeout(() => {
                    winScreen.style.display = "flex";
                    mainElement.style.display = "none";
                    confettiTimeline.play();
                }, 4000);

                allPlayButtons.forEach(button => {
                    button.innerHTML = "";
                });
            } else {

                // Code to determine which level is completed
                let puzzleIndex = this.img.indexOf("puzzle") + 6;
                let puzzleElemIndex = this.img.indexOf("/elem");
                let referenceID = this.img.substring(puzzleIndex, puzzleElemIndex) - 1;

                // Store completed levels
                completedArray.push(referenceID);

                let completedPuzzleElem = document.getElementById(`obj${referenceID}`);
                let completedPuzzleButton = document.getElementById(`objbtn${referenceID}`);
                completedPuzzleButton.style.opacity = .4;
                completedPuzzleButton.style.pointerEvents = "none";

                completedPuzzleElem.style.opacity = .4;
                completedPuzzleButton.innerHTML = "COMPLETED";

                setTimeout(() => {
                    menuAnimate.restart();
                    gsap.to(factBox, { autoAlpha: 0 });
                }, 4500)

                setTimeout(() => {
                    menuAnimate.pause();
                }, 5250)

                setTimeout(() => {
                    encouragementScreen.style.display = "flex";
                }, 5250)

                encouragementButton.addEventListener("click", () => {
                    encouragementScreen.style.display = "none";
                    menuAnimate.resume();
                })
            }
        }
    }

    // Buttons
    let theButtons = document.querySelectorAll('.buttons');
    theButtons.forEach(function (theBtn, index) {
        switch (index) {
            case 0: // Home
                theBtn.addEventListener('click', () => {
                    stopTimer();
                    menuAnimate.restart();

                    // Code to reset score to 0 if level is not completed
                    if (scoreValue === completedArray.length * 5) {

                    } else {
                        scoreValue = completedArray.length * 5;
                        document.getElementById("score").innerHTML = scoreValue;
                        document.getElementById("scoreMain").innerHTML = scoreValue;
                    }
                });
                break;
            case 1: // Shuffle
                theBtn.addEventListener('click', () => {
                    gsap.to(theObjects, { autoAlpha: 1 });
                    gsap.to('.boardStyle', { opacity: 1 });
                    shuffleRoutine();

                    scoreValue = completedArray.length > 0 ? completedArray.length * 5 : 0;

                    document.getElementById("score").innerHTML = scoreValue;
                    document.getElementById("scoreMain").innerHTML = scoreValue;
                });
                break;
            default:
                menuAnimate();
                break;
        }
    });

    let playAgainButton = document.getElementById("playAgain");
    let playAgainTimeoutButton = document.getElementById("playAgainTimeout");

    let allPlayButtons = document.querySelectorAll(".playButton");

    playAgainTimeoutButton.addEventListener("click", () => {

        scoreValue = 0;
        document.getElementById("scoreMain").innerHTML = scoreValue;

        timeoutScreen.style.display = "none";
        completedArray = [];
        mainElement.style.display = "flex";

        puzzleButtons.forEach(b => {
            b.style.opacity = "1";
            b.style.pointerEvents = "auto";
        });

        puzzle.forEach(p => {
            p.style.opacity = 1;
        });

        allPlayButtons.forEach(button => {
            button.innerHTML = "";
        });

        menuAnimate.resume();
    });

    playAgainButton.addEventListener("click", () => {

        scoreValue = 0;
        document.getElementById("scoreMain").innerHTML = scoreValue;

        winScreen.style.display = "none";
        completedArray = [];
        mainElement.style.display = "flex";

        puzzleButtons.forEach(b => {
            b.style.opacity = "1";
            b.style.pointerEvents = "auto";
        });

        puzzle.forEach(p => {
            p.style.opacity = 1;
        });

        allPlayButtons.forEach(button => {
            button.innerHTML = "";
        });

        menuAnimate.restart();
    });

    // Animations
    theButtons.forEach(function (btn) {

        let hoverAnimation = gsap.to(btn, {
            paused: true,
            y: -4,
            duration: .2,
        });

        btn.addEventListener("mouseenter", () => hoverAnimation.play());
        btn.addEventListener("mouseleave", () => hoverAnimation.reverse());
    })
}