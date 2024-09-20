# iq-test

iq test with generated questions

## Demo

https://bobanko.github.io/iq-test/

## inspiration

good detailed stats, by countries etc.  
https://international-iq-test.com/  
test results sample here  
https://international-iq-test.com/ru/6695aaa1-c870-4010-88dc-4a8395ca4579

stylish, good questions  
https://testometrika.com/blog/a-test-to-determine-the-iq-level-of-ravena/

MENSA test, bizarre questions, bw  
https://www.mensa.org/mensa-iq-challenge/

this one is scam, but has stylish questions  
**WARNING**: DO NOT pay for that!  
https://iqboost.mobi/

some more tests to discover:
https://www.123test.com/classical-intelligence-test/?d=1

## TO-DO

rotational
[x] make (wrong) answers  
[x] fix do-not-repeat between rows  
[x] make types:  
[x] arrow + circle
[x] quarters (multiple)
[x] quarters + circle + square
[x] overlap/no overlap -- think about it

[ ] fix square to look normal with circle

[ ] probably make questions switch animation as slider LtoR,
so user can swipe questions. it can be hard to impl instant swap,
when there are 40 questions, so ...

[ ] when answered - move to unanswered question, if 0 -- propose to finish.

[x] add static images as parts via config  
[x] impl different configurable bgs

[ ] custom image rotation type (plane/knight/pencil) -- think about it
[ ] non90deg shuffles - 6star, 5star -- draw mocks
[ ] shuffled types: rotational + stupid shuffle in one -- think about it

other
[ ] make more custom settings for easier gen test
[ ] make hash based random to reprod cases from other users etc.
[ ] make level select -- 20x, can select, see wrong/correct, navigation, progress, timer?

matrix-move
[ ] fix questions to do-not-overlap

formulas
[ ] fix ambigous answers -- when multiple are correct, no + + + formulas, less \*1 formulas
