# A Drop of Maths - Testing

[Return](README.md) to A Drop of Maths README file.

[Play the game](https://martinbannister.github.io/CI_MS2_aDropOfMaths/).

---


### HTML Validation
I used the [W3C Markup Validation Service](https://validator.w3.org/) to validate the HTML of all the pages on the site. Initially the pages showed some errors and these were corrected.

Links to the inial report and the final result with no errors are in the table below.

- [index.html](assets/docs/images/testing/html_validator_game.png) 

- [game.html](assets/docs/images/testing/html_validator_game.png)

- [high_scores.html](assets/docs/images/testing/html_validator_high_scores.png) 

[Back to Index](#table-of-contents)

### CSS Validation
I used the [W3C CSS Validation Service](http://jigsaw.w3.org/css-validator/validator) to validate my style.css file of the site.

The CSS passed first time with [zero errors](assets/docs/images/testing/css_validator_styles.png).

[Back to Index](#table-of-contents)

### Accessibility
I used the [WAVE WebAIM web accessibility evaluation tool]() to check that there we no issues with accessibility standards.  

All pages pass without errors except for high_scores.html.


Click on the links to see each report:

- [Wave index.html](assets/docs/images/testing/wave_report_index.png)

- [Wave game.html](assets/docs/images/testing/wave_report_game.png)

- [Wave high_scores.html](assets/docs/images/testing/wave_report_high_scores.png)

[Back to Index](#table-of-contents)

### Performance

[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) 

- [Lighthouse index.html](assets/docs/images/testing/lighthouse_index.png)

- [Lighthouse game.html](assets/docs/images/testing/lighthouse_game.png)

- [Lighthouse high_scores.html](assets/docs/images/testing/jshint_high_scores_html.png)

### JSHint testing

[JSHint game.js](assets/docs/images/testing/jshint_game_js.png)

[JSHint high_scores.js](assets/docs/images/testing/jshint_high_scores_html.png)

### Tests on Various Devices

#### Devices Tested
- Redmi Note 9
- Honor Play
- Lenovo Thinkpad C13 Yoga (Chrome & Firefox)

#### Tests Performed

### Testing User Stories

The following video shows the testing of user stories 1 to 13, excluding 9.  It demonstrates the variablility of the game settings, the ability to very the type of calculation and how to see pevious scores.  It does not show user story 9, which would be covered by the adult theme.

https://user-images.githubusercontent.com/78867133/134156960-e464363a-23eb-4beb-99e5-482454b8df91.mp4


### Browser Compatibility
- Google Chrome


## Bugs found and resolved during development

**🐝 BUG: Scroll settings DIV on short screen**

[https://stackoverflow.com/questions/3837037/div-with-scrollbar-inside-div-with-positionfixed#answer-3837111](https://stackoverflow.com/questions/3837037/div-with-scrollbar-inside-div-with-positionfixed#answer-3837111)

**🐝 BUG: Uncaught RangeError: Maximum call stack size exceeded** 

[https://stackoverflow.com/questions/6095530/maximum-call-stack-size-exceeded-error](https://stackoverflow.com/questions/6095530/maximum-call-stack-size-exceeded-error)

