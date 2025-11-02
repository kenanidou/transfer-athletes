$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  function getQuestions() {
    return fetch("questions-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.questions ? Object.keys(data.questions).length : data.length;

        return fetch("questions-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);
            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);
        hideFormBtns();
      });
  }

  function getEvidences() {
    return fetch("questions-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        totalEvidences = data.length;

        return fetch("questions-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);
            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);
        hideFormBtns();
      });
  }

  function getFaq() {
    return fetch("questions-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        totalFaq = data.length;

        return fetch("questions-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en:", error);
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

  function getEvidencesById(id) {
    var selectedEvidence;
    currentLanguage === "greek"
      ? (selectedEvidence = all_evidences)
      : (selectedEvidence = all_evidences_en);
    selectedEvidence = selectedEvidence.PublicService.evidence.find(
      (evidence) => evidence.id === id
    );

    if (selectedEvidence) {
      const evidenceListElement = document.getElementById("evidences");
      selectedEvidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    } else {
      console.log(`Evidence with ID '${givenEvidenceID}' not found.`);
    }
  }

  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
          ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">' + "myKEPlive" + "</a>" + "."
    );
  }

  function loadQuestion(questionId, noError) {

    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    } 

    currentLanguage === "greek"
      ? (question = all_questions.questions ? all_questions.questions[Object.keys(all_questions.questions)[questionId]] : all_questions[questionId])
      : (question = all_questions_en.questions ? all_questions_en.questions[Object.keys(all_questions_en.questions)[questionId]] : all_questions_en[questionId]);
    var questionElement = document.createElement("div");

    if (noError) {
      questionElement.innerHTML = `
                <div class='govgr-field'>
                    <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
                        <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                            ${question.question}
                        </legend>
                        <div class='govgr-radios' id='radios-${questionId}'>
                            <ul>
                                ${question.options
                                  .map(
                                    (option, index) => `
                                    <div class='govgr-radios__item'>
                                        <label class='govgr-label govgr-radios__label'>
                                            ${option}
                                            <input class='govgr-radios__input' type='radio' name='question-option' value='${index+1}' />
                                        </label>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    </fieldset>
                </div>
            `;
    } else {
      questionElement.innerHTML = `
            <div class='govgr-field govgr-field__error' id='$id-error'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                        ${question.question}
                    </legend>
                <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
                    <legend  class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
                        Επιλέξτε την απάντησή σας
                    </legend>
                    <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
                    <div class='govgr-radios id='radios-${questionId}'>
                        <p class='govgr-error-message'>
                            <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                            <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
                        </p>

                            ${question.options
                              .map(
                                (option, index) => `
                                <div class='govgr-radios__item'>
                                    <label class='govgr-label govgr-radios__label'>
                                        ${option}
                                        <input class='govgr-radios__input' type='radio' name='question-option' value='${index+1}' />
                                    </label>
                                </div>
                            `
                              )
                              .join("")}
                    </div>
                </fieldset>
            </div>
        `;

      if (currentLanguage === "english") {
        var components = Array.from(
          questionElement.querySelectorAll(".language-component")
        );
        components.slice(-4).forEach(function (component) {
          var componentName = component.dataset.component;
          component.textContent =
            languageContent[currentLanguage][componentName];
        });
      }
    }

    $(".question-container").html(questionElement);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν δικαιούστε το δελτίο μετακίνησης ΑΜΕΑ!"
        : "We are sorry but you are not entitled to the transportation card for the disabled!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  function retrieveAnswers() {
    var allAnswers = [];
    getEvidencesById(1);
    for (var i = 0; i < totalQuestions; i++) {
      var answer = sessionStorage.getItem("answer_" + i);
      allAnswers.push(answer);
    }
    if (allAnswers[0] === "2") {
      getEvidencesById(9);
    }
    if (allAnswers[2] === "4") {
      getEvidencesById(11);
    }
    if (allAnswers[4] === "1") {
      getEvidencesById(6);
    } else if (allAnswers[4] === "2") {
      getEvidencesById(7);
    } else if (allAnswers[4] === "3") {
      getEvidencesById(8);
    }
    if (
      allAnswers[5] === "1" ||
      (allAnswers[5] === "2")
    ) {
      getEvidencesById(10);
      currentLanguage === "greek"
        ? setResult("Δικαιούται και ο συνοδός το ίδιο δελτίο μετακίνησης.")
        : setResult("The companion is also entitled with the same transportation card.");
    }

    if (allAnswers[6] === "2") {
      getEvidencesById(3);
      getEvidencesById(4);
    } else if (allAnswers[6] === "3") {
      getEvidencesById(3);
      getEvidencesById(5);
    }
    if (allAnswers[7] === "1") {
      getEvidencesById(12);
      currentLanguage === "greek"
      ? setResult(
          "Δικαιούστε έκπτωση 50% για τις εκτός ορίων της περιφέρειας σας μετακινήσεις με υπεραστικά ΚΤΕΛ."
        )
      : setResult(
          "You are entitled to a 50% discount for transportation outside the boundaries of your region with long-distance bus services (named KTEL)."
        );
    } else if (allAnswers[7] === "2" && allAnswers[5] !== "1") {
      getEvidencesById(2);
      if (allAnswers[8] === "1") {
        currentLanguage === "greek"
          ? setResult(
              "Δικαιούσαι δωρεάν μετακίνησης με τα αστικά μέσα συγκοινωνίας της περιφέρειας σου και έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
            )
          : setResult(
              "You are entitled to free transportation with the urban public bus of your region and a 50% discount for transportation outside the boundaries of your region with long-distance (intercity) bus services (named KTEL)."
            );
      } else if (allAnswers[8] === "2") {
        currentLanguage === "greek"
          ? setResult(
              "Δικαιούσαι έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
            )
          : setResult(
              "You are entitled to a 50% discount for transportation outside the boundaries of your region with long-distance bus services (named KTEL)."
            );
      }
    }
    else if(allAnswers[7] === "2" && allAnswers[5] === "1"){
      currentLanguage === "greek"
      ? setResult(
          "Δικαιούσαι δωρεάν μετακίνησης με τα αστικά μέσα συγκοινωνίας της περιφέρειας σου και έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
        )
      : setResult(
          "You are entitled to free transportation with the urban public bus of your region and a 50% discount for transportation outside the boundaries of your region with long-distance (intercity) bus services (named KTEL)."
        );
    }
  }

  function submitForm() {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Είστε δικαιούχος!"
        : "You are eligible!";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);

    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά που πρέπει να προσκομίσετε για να λάβετε το δελτίο μετακίνησης είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The documents you need to provide in order to receive your transportation card are the following:</h5><br />"
        );
    $(".question-container").append(evidenceListElement);
    $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  $("#nextQuestion").click(function () {
    if ($(".govgr-radios__input").is(":checked")) {
      var selectedRadioButtonIndex =
        $('input[name="question-option"]').index(
          $('input[name="question-option"]:checked')
        ) + 1;
      console.log(selectedRadioButtonIndex);
      if (currentQuestion === 0 && selectedRadioButtonIndex === 3) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Μπορείτε να το εκδώσετε ξανά μόνο μια φορά μετά από απώλεια.") : skipToEnd("You can reissue it only one time after loss.");
      } else if (currentQuestion === 1 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να είστε μόνιμος και νόμιμος κάτοικος της Ελλάδας.") : skipToEnd("You must be permanent and legal resident of Greece.");
      } else if (currentQuestion === 3 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Πρέπει να έχετε ποσοστό αναπηρίας 67% και άνω ή να είστε δικαιούχος του επιδόματος ΟΠΕΚΑ.") : skipToEnd("You must have a disability rate of 67% or more or be a beneficiary of the OPEKA benefit.");
      } else {
        userAnswers[currentQuestion] = selectedRadioButtonIndex;
        sessionStorage.setItem(
          "answer_" + currentQuestion,
          selectedRadioButtonIndex
        );

        if (currentQuestion + 1 == totalQuestions) {
          submitForm();
        } else {
          currentQuestion++;
          loadQuestion(currentQuestion, true);

          if (currentQuestion + 1 == totalQuestions) {
            currentLanguage === "greek"
              ? $(this).text("Υποβολή")
              : $(this).text("Submit");
          }
        }
      }
    } else {
      loadQuestion(currentQuestion, false);
    }
  });

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1)
      loadQuestion(currentQuestion, true);
  });

  $("#questions-btns").hide();

  getQuestions().then(() => {
    getEvidences().then(() => {
      getFaq().then(() => {
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});