package com.sanmina.surveyengine.model;

import com.sanmina.surveyengine.enumerable.InputType;

/**
 * Embedded Class Created by gerardo_martinez on 23/06/16.
 */
public class Answer {
    public String inputId;
    public String questionText;
    public String answer;
    public InputType type;

    public Answer() {

    }

    public String getInputId() {
        return inputId;
    }

    public void setInputId(String inputId) {
        this.inputId = inputId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public InputType getType() {
        return type;
    }

    public void setType(InputType type) {
        this.type = type;
    }
}
