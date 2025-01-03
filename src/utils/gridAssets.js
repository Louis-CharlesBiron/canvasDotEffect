// all sources should be built with "D", this object provides all the cardinal and intercardinal directions that should link the dots to create symbols
const D = [["t","-ar"],["r",1],["b","ar"],["l",-1],["tr","1-ar"],["br","ar+1"],["bl","ar-1"],["tl","-ar-1"]].reduce((a,[b,d],i)=>(a.places.push([a[b]=1<<i,(ar)=>new Function("ar",`return ${d}`)(ar)]),a),{places:[]})

// Any source should contain: the width and height of all its symbols, and the symbols definitions (key in uppercase)
/* To create a symbol: [...[index, directions]]
 * A symbol is composed of a main array, containing the sub-arrays
 * - The main array defines the vertical layers, a new layer is created each time an horizontal index of is lower than the last
 * - The sub-arrays each define a dot, its horizontal index and the directions of its connections
 *
 * Example for creating the letter "A" in a 5x5 source, which looks like this
 *
 *     0   1   2   3   4
 *  0          o
 *  1      o       o
 *  2  o   o   o   o   o
 *  3  o               o
 *  4  o               o
 *
 * STEPS:
 * 1. Creating the main array -> [] 
 * 2. The 1st vertical layer (vertical index 0) -> 
 *   since the "A" symbol doesn't have any dot at (0,0) and (1,0), the first dot is at the coords (2, 0)
 *   because we're at the first vertical layer, the vertical index is automatically taken care of,  
 *   for the horizontal index, we need to specify it in the sub-array. -> [2,] -> [ [2,] ]
 * 3. A dot is now placed at (2,0), but it still has no connection to any other dot, to add connections,
 *   we use the "D" constant. ---Note: always define connections from upper dots to lower dots, and from left to right, to avoid redundancy---
 *   in this example, the needed connections are with the dots at (1, 1) and (3, 1). To achieve these, 
 *   we add a bottom-left (bl) and a bottom-right (br) connections as the second parameter of the sub-array -> [2, D.bl + D.br] -> [ [2,D.bl+D.br] ]
 * 4. Since the first layer had only a single dot, it now has the correct placement and connections, let's continue the example with the second layer:
 *   This layer has dots only at (1, 1) and (3, 1), so we can create the following sub-arrays -> [1,] and [3,].
 *   ---Note: A new vertical layer is created since the first's sub-array horizontal index (1) is smaller than the previous sub-array's one (2)---
 *   Looking at the "A" graph above, the entire 3rd layer (vertical index 2) is filled with dots. 
 *   Though, to make the letter "A", we only need to connect to the dots at (0, 2) and (4, 2).
 *   We achieve these two connections by updating our previous sub-arrays like this -> [1, D.bl] and [3, D.br]
 * 5. Continue the process until the symbol if fully formed
 *
 *  Particuliarities: 
 *   - Leaving a sub-array's horizontal index empty (ex: [,D.br]), will take in value the increment of the previous sub-array horizontal index
 *   - Leaving a sub-array's connections parameter empty (ex: [2]), will make it so the dot does not initiate any connection
 *   - Leaving a sub-array completely empty (ex: []) logically implies that a dot will be created at the next horizontal index and that it won't initiate connections
 */ 
const fontSource5x5 = {
    width:5,
    height:5,
    A: [
        [2,D.bl+D.br],
        [1,D.bl],[3,D.br],
        [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
        [0,D.b],[4,D.b],
        [0],[4]
    ],
    B: [
        [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
        [0,D.b],[4,D.bl],
        [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
        [0,D.b],[4,D.bl],
        [0,D.r],[,D.r],[,D.r],[]
    ],
    C: [
        [1,D.r+D.bl],[,D.r],[,D.r],[],
        [0,D.b],
        [0,D.b],
        [0,D.br],
        [-1,D.r],[2,D.r],[,D.r],[]
      ],
    D: [
        [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
        [0,D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.b],[4,D.bl],
        [0,D.r],[,D.r],[,D.r],[]
    ],E: [
        [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
        [0,D.b],
        [0,D.b+D.r],[,D.r],[,D.r],[,D.r],
        [0,D.b],
        [0,D.r],[,D.r],[,D.r],[,D.r],[]
    ],F: [
        [0,D.r+D.b],[,D.r],[,D.r],[,D.r],[],
        [0,D.b],
        [0,D.b+D.r],[,D.r],[,D.r],[],
        [0,D.b],
        [0]
    ],G: [
        [1,D.r+D.bl],[,D.r],[,D.r],[],
        [0,D.b],
        [0,D.b],[3,D.r],[4,D.b],
        [0,D.br],[4,D.b],
        [1,D.r],[,D.r],[,D.r],[]
    ],H: [
        [0,D.r+D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.b+D.r],[,D.r],[,D.r],[,D.r],[,D.b],
        [0,D.b],[4,D.b],
        [0],[4]
    ],I: [
        [1,D.r],[,D.b+D.r],[],
        [2,D.b],
        [2,D.b],
        [2,D.b],
        [1,D.r],[,D.r],[]
    ],J: [
        [1,D.r],[,D.r],[,D.b+D.r],[],
        [3,D.b],
        [3,D.b],
        [0,D.br],[3,D.bl],
        [1,D.r],[,D.r]
    ],K: [
        [0,D.b],[3,D.bl],
        [0,D.b],[2,D.bl],
        [0,D.b+D.r],[,D.r+D.br],
        [0,D.b],[2,D.br],
        [0],[3,D.r]
    ],L: [
        [0,D.b],
        [0,D.b],
        [0,D.b],
        [0,D.b],
        [0,D.r],[,D.r],[,D.r],[,D.r]
    ],M: [
        [0,D.b+D.br],[4,D.b+D.bl],
        [0,D.b],[,D.br],[3,D.bl],[4,D.b],
        [0,D.b],[2],[4,D.b],
        [0,D.b],[4,D.b],
        [0],[4]
    ],N: [
        [0,D.b+D.br],[4,D.b],
        [0,D.b],[,D.br],[4,D.b],
        [0,D.b],[2,D.br],[4,D.b],
        [0,D.b],[3,D.br],[4,D.b],
        [0],[4]
    ],O: [
        [1,D.bl+D.r],[,D.r],[,D.br],
        [0,D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.b+D.br],[4,D.b+D.bl],
        [1,D.r],[,D.r],[,D.r]
    ],P: [
        [0,D.r+D.b],[,D.r],[,D.br],
        [0,D.b],[3,D.bl],
        [0,D.b+D.r],[,D.r],[],
        [0,D.b],
        [0]
    ],Q: [
        [1,D.bl+D.r],[,D.r],[,D.br],
        [0,D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.b+D.br],[3,D.br],[,D.bl],
        [1,D.r],[,D.r],[],[]
    ],R: [
        [0,D.r+D.b],[,D.r],[,D.br],
        [0,D.b],[3,D.bl],
        [0,D.b+D.r],[,D.r+D.br],[],
        [0,D.b],[2,D.br],
        [0],[3]
    ],S: [
        [1,D.r+D.bl],[,D.r],[,D.r],[],
        [0,D.br],
        [-1,D.r],[2,D.r],[,D.br],
        [-4,D.bl],
        [0,D.r+D.bl],[,D.r],[,D.r],[]
    ],T: [
        [0,D.r],[,D.r],[,D.b+D.r],[,D.r],[],
        [2,D.b],
        [2,D.b],
        [2,D.b],
        [2]
    ],U: [
        [0,D.r+D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.b+D.r],[4,D.b],
        [0,D.br],[4,D.bl],
        [1,D.r],[,D.r],[,D.r]
    ],V: [
        [0,D.r+D.b],[4,D.b],
        [0,D.b],[4,D.b],
        [0,D.br],[4,D.bl],
        [1,D.br],[3,D.bl],
        [2,D.r],
    ],W: [
        [0,D.b+D.br],[4,D.b+D.bl],
        [0,D.b],[4,D.b],
        [0,D.b],[2,D.bl+D.br],[4,D.b],
        [0,D.b],[,D.bl],[3,D.br],[4,D.b],
        [0],[4]
    ],X: [
        [0,D.br],[4,D.bl],
        [1,D.br],[3,D.bl],
        [2,D.br+D.bl],
        [1,D.bl],[3,D.br],
        [0],[4]
    ],Y: [
        [0,D.br],[4,D.bl],
        [1,D.br],[3,D.bl],
        [2,D.b],
        [2,D.b],
        [2]
    ],Z: [
        [0,D.r],[,D.r],[,D.r],[,D.r],[,D.bl],
        [3,D.bl],
        [2,D.bl],
        [1,D.bl],
        [0,D.r],[,D.r],[,D.r],[,D.r],[]
    ]
}