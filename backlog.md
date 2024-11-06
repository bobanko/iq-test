## TO-DO

ui

[ ] probably make questions switch animation as slider LtoR,
so user can swipe questions. it can be hard to impl instant swap,
when there are 40 questions, so ...

[ ] when answered - move to unanswered question, if 0 -- propose to finish.

rotational

[ ] fix squares(rot parts) to look normal with circles(rot parts)

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

[ ] add skins with diff colors palettes

[ ] fix styles when clicking on answered answer (yellow becomes gray)

---

[x] make (wrong) answers  
[x] fix do-not-repeat between rows  
[x] make types:  
[x] arrow + circle
[x] quarters (multiple)
[x] quarters + circle + square
[x] overlap/no overlap -- think about it
[x] add static images as parts via config  
[x] impl different configurable bgs

## conceptions:

cumulative IQ -- user passes test 1 or more times, iq updates, like: 5/10, 12/20, 17/30, 24/40; etc.
like taxi rating. user can see iq per pass, or cumulative, avg per week, month, year, etc.

to record how people pass test and talks /w video?
examples:
'kvadratiki ebanie','kakim nahoi obrazom, prosto perevernula'(c)kris

-

# 16-oct notes

## color3Frames

colors per pattern should be unique
same for answers?
allow default bg to be hidden? [1]

## rotColorQuarters

no bg, allow custom bg [1]

## rotColorTriangles

allow random colors?
try to recreate origin

## figDice

come up with new variants, not only 123,345,56(7)
make graphics more crisp
rounded corners for cubes (10px-20px)
more prominent colors?

## rotIcons

rotate only icons, not bg [2]

## colRotHalves

rotate only icons, not bg [2]
svg fix white corners
fix gen logic with rotations

## figRotSpades

allow other icons - hearts, clubs, diamonds
fix for windows

## figRotLetters

allow bg coloring

## fig2_RectTriangleCircle

fix red color borders to be more recognizable (maybe brown-ish?)

## fig1_RectTriangleCircle

add more answers? rotate triangle?

## default_resize

remove yellow color, add others [3]
add diagonal stretching?
add more figs?

## numToAbc

disable user selection

## crossDots8xor

recolor dots (red?) [3]

## dice8xor

allow other colors [3]

## circle6xor

allow other colors [3]
randomize circle appearance somehow?

## triangles8xor

add colors [3]
allow multicolor? to increase complexity

## arc12xor

remove as shitty one OR add symmetry?

## arc4xor

increase readability somehow?

## flake_xor4cut8

make pipe skin?
fix situation with no sub (when only addition is present)

## add and others matrix add

remove yellow as single color
OR decease it (maybe make additional mixin for that? or just dark-yellow)

## letters45

remove? as similar to shuffle OR keep as simplier riddle? add diff rows?

## oneQuarter90

fix sector borders, make it thick

## clock4590

redesign figures [4]

## pentagon & hexagonCircle

redesign figures [4] dots are too close to borders

## hexagonCircle

try to make razvertka riddle based on hex graphics

## hexagonSector2

do not allow overlap? [5]

## triadSector

do not allow overlap? [5] or render it in a different way?
striped? /// how is it possible?

## color1ruleMix & color1ruleMix2

add more answers