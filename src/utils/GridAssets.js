class GridAssets {
    static D = ["t","r","b","l","tr","br","bl","tl","i"].reduce((a,b,i)=>(a.places.push([a[b]=1<<i,(ar)=>{if(i==0){return -ar}else if(i==1){return 1}else if(i==2){return ar}else if(i==3){return -1}else if(i==4){return 1-ar}else if(i==5){return ar+1}else if(i==6){return ar-1}else if(i==7){return -ar-1}else if(i==8){return 0}}]),a),{places:[]})
    static DEFAULT_SOURCE = GridAssets.fontSource5x5

    static get fontSource5x5() {
        const D = GridAssets.D
        return {
            width:5,
            height:5,
            A: [
                [2,D.bl+D.br],
                [1,D.bl],[3,D.br],
                [0,D.r+D.b],[1,D.r],[2,D.r],[3,D.r],[4,D.b],
                [0,D.b],[4,D.b],
                [0],[4]
            ],B: [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r+D.b],[,D.r],[,D.r],[,D.br],
                [0,D.b],[4,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],C: [
                [1,D.r+D.bl],[,D.r],[,D.r],[],
                [0,D.b],
                [0,D.b],
                [0,D.br],
                [-1,D.r],[2,D.r],[,D.r],[]
            ],D: [
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
            ],a: [
                [Infinity],
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.br],[3,D.bl+D.br],
                [1,D.r],[],[4,]
            ],b: [
                [0,D.b],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.r],[,D.r],[,D.r]
            ],c: [
                [Infinity],
                [1,D.r+D.bl],[,D.r],[],
                [0,D.b],
                [0,D.br],
                [-1,D.r],[2,D.r],[]
            ],d: [
                [3,D.b],
                [3,D.b],
                [1,D.bl+D.r],[,D.r],[,D.b],
                [0,D.br],[3,D.b],
                [1,D.r],[,D.r],[]
            ],e: [
                [1,D.r+D.bl],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.br],[3,D.bl],
                [1,D.r],[]
            ],f: [
                [1,D.b+D.r],[],
                [1,D.b],
                [0,D.r],[,D.r+D.b],[],
                [1,D.b],
                [1]
            ],g: [
                [1,D.bl+D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[]
            ],h: [
                [0,D.b],
                [0,D.b],
                [0,D.b+D.r],[,D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0],[3]
            ],i: [
                [Infinity],
                [1,D.i],
                [1,D.b],
                [1,D.b],
                [1]
            ],j: [
                [2,D.i],
                [2,D.b],
                [2,D.b],
                [0,D.br],[2,D.bl],
                [1]
            ],k: [
                [0,D.b],
                [0,D.b],[2,D.bl],
                [0,D.b],[2,D.bl],
                [0,D.b+D.r],[,D.br],
                [0],[2]
            ],l: [
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0,D.b],
                [0],
            ],m: [
                [Infinity],
                [1,D.bl+D.br],[3,D.bl+D.br],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.b],[2,D.b],[4,D.b],
                [0],[2],[4],
            ],n: [
                [Infinity],
                [0,D.b],[,D.bl+D.r],[,D.bl+D.br],
                [0,D.b],[3,D.b],
                [0,D.b],[3,D.b],
                [0],[3],
            ],o: [
                [Infinity],
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.br],[3,D.bl],
                [1,D.r],[],
            ],p: [
                [1,D.r+D.bl],[,D.br],
                [0,D.b],[3,D.bl],
                [0,D.b+D.r],[,D.r],[],
                [0,D.b],
                [0]
            ],q: [
                [1,D.r+D.bl],[,D.br],
                [0,D.br],[3,D.b],
                [1,D.r],[,D.r],[,D.b],
                [3,D.b],
                [3]
            ],r: [
                [Infinity],
                [0,D.b],[,D.bl+D.r],[],
                [0,D.b],
                [0,D.b],
                [0],
            ],s: [
                [Infinity],
                [2,D.bl+D.br],
                [1,D.br],[3],
                [1,D.br],[2,D.r],[,D.b],
                [2,D.r],[]
            ],t: [
                [2,D.b],
                [1,D.r],[,D.b+D.r],[],
                [2,D.b],
                [2,D.b],
                [2]
            ],u: [
                [Infinity],
                [0,D.b],[2,D.b],
                [0,D.b],[2,D.b],
                [0,D.br],[2,D.bl+D.br],
                [1,D.r],[3,]
            ],v: [
                [Infinity],
                [1,D.b],[3,D.b],
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.r],
            ],w: [
                [Infinity],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.b],[2,D.b],[4,D.b],
                [0,D.br],[2,D.bl+D.br],[4,D.bl],
                [1],[3],
            ],x: [
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.br+D.bl],
                [1,D.b],[3,D.b],
                [1],[3],
            ],y: [
                [Infinity],
                [1,D.b],[3,D.b],
                [1,D.br],[3,D.bl],
                [2,D.b],
                [2]
            ],z: [
                [Infinity],
                [0,D.r],[,D.r],[,D.r],[,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[]
            ],"!": [
                [3,D.b],
                [3,D.b],
                [3,D.b],
                [3],
                [3, D.i],
            ],"?": [
                [1,D.r+D.bl],[,D.r],[,D.br],
                [0],[4,D.bl],
                [3,D.bl],
                [2],
                [2, D.i],
            ],"@": [
                [1,D.bl+D.r],[,D.r],[,D.br],
                [0,D.b],[2,D.bl+D.br],[4,D.b],
                [0,D.b],[1,D.br],[3,D.b],[4,D.b],
                [0,D.b+D.br],[2,D.r],[3,D.r],[4],
                [1,D.r],[,D.r],[,D.r]
            ],"#": [
                [1,D.b],[3,D.b],
                [0,D.r],[1,D.b+D.r],[2,D.r],[3,D.b+D.r],[],
                [1,D.b],[3,D.b],
                [0,D.r],[1,D.b+D.r],[2,D.r],[3,D.b+D.r],[],
                [1],[3],
            ],"$": [
                [1,D.r+D.bl],[,D.r+D.b],[,D.r],[],
                [0,D.br],[2,D.b],
                [1,D.r],[2,D.r+D.b],[,D.br],
                [2,D.b],[4,D.bl],
                [0,D.r+D.bl],[,D.r],[,D.r],[]
            ],"%": [
                [0,D.r+D.b],[1,D.b],[4,D.bl],
                [0,D.r],[],[3,D.bl],
                [2,D.bl],
                [1,D.bl],[3,D.r+D.b],[4,D.b],
                [0],[3,D.r],[]
            ],"^": [
                [2,D.br+D.bl],
                [1],[3],
            ],"&": [
                [0,D.r+D.br],[,D.r],[,D.r],[,D.bl],
                [1,D.br],[2,D.bl],
                [1,D.bl],[2,D.br],
                [0,D.br],[3,D.br],[,D.bl],
                [1,D.r],[2,D.r],[3],[],
            ],"*": [
                [1,D.br],[,D.b],[,D.bl],
                [1,D.r],[,D.r],[],
                [1,D.tr],[,D.t],[,D.tl]
            ],"(": [
                [3,D.bl],
                [2,D.b],
                [2,D.b],
                [2,D.br],
                [-3]
            ],")": [
                [1,D.br],
                [-2,D.b],
                [2,D.b],
                [2,D.bl],
                [1]
            ],"{": [
                [3,D.bl],
                [2,D.b],
                [1,D.r],[2,D.b],
                [2,D.br],
                [-3]
            ],"}": [
                [1,D.br],
                [-2,D.b],
                [2,D.b+D.r],[],
                [2,D.bl],
                [1]
            ],",": [
                [Infinity],
                [Infinity],
                [Infinity],
                [1,D.bl],
                [0]
            ],".": [
                [Infinity],
                [Infinity],
                [Infinity],
                [Infinity],
                [0,D.i]
            ],"+": [
                [Infinity],
                [2,D.b],
                [1,D.r],[2,D.b+D.r],[],
                [2],
            ],"_": [
                [Infinity],
                [Infinity],
                [Infinity],
                [Infinity],
                [0,D.r],[,D.r],[,D.r],[,D.r],[,D.r],
            ],"-": [
                [Infinity],
                [Infinity],
                [1,D.r],[,D.r],[]
            ],"=": [
                [Infinity],
                [1,D.r],[,D.r],[,D.r],
                [Infinity],
                [1,D.r],[,D.r],[,D.r],
            ],";": [
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[,D.b],
                [3],
            ],":": [
                [Infinity],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
                [2,D.r+D.b],[3,D.b],
                [2,D.r],[],
            ],"[": [
                [2,D.b+D.r],[3],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.r],[3]
            ],"]": [
                [1,D.r],[2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[2]
            ],"'": [
                [0,D.b],
                [0]
            ],"|": [
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2,D.b],
                [2],
            ],"/": [
                [4,D.bl],
                [3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0]
            ],"\\": [
                [0,D.br],
                [-1,D.br],
                [-2,D.br],
                [-3,D.br],
                [-4]
            ],"0": [
                [1,D.bl+D.r],[,D.br],
                [0,D.b],[3,D.b],
                [0,D.b],[,D.r],[],[,D.b],
                [0,D.b+D.br],[3,D.b+D.bl],
                [1,D.r],[,D.r]
            ],"1": [
                [2,D.b+D.bl],
                [1],[,D.b],
                [2,D.b],
                [2,D.b],
                [1,D.r],[,D.r],[],
            ],"2": [
                [1,D.r+D.bl],[,D.br],
                [0],[3,D.bl],
                [2,D.bl],
                [1,D.bl],
                [0,D.r],[,D.r],[,D.r],[,D.r],
            ],"3": [
                [1,D.r+D.bl],[,D.br],
                [0],[3,D.bl],
                [2,D.br],
                [0,D.br],[3,D.bl],
                [1,D.r],[,D.r]
            ],"4": [
                [3,D.b+D.bl],
                [2,D.bl],[,D.b],
                [1,D.bl],[3,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r+D.b],[,D.r],
                [3],
            ],"5": [
                [1,D.r+D.b],[,D.r],[,D.r],[],
                [1,D.b],
                [-1,D.r],[2,D.r],[,D.br],
                [-4,D.bl],
                [1,D.r+D.bl],[,D.r],[]
            ],"6": [
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r],
                [0,D.b],
                [0,D.r+D.b],[,D.r],[,D.r],[,D.r+D.b],
                [0,D.b],[3,D.b],
                [0,D.r],[,D.r],[,D.r],[,D.r],
            ],"7": [
                [0,D.r],[,D.r],[,D.r],[,D.b],
                [3,D.bl],
                [1,D.r],[,D.bl+D.r],[],
                [1,D.bl],
                [0]
            ],"8": [
                [1,D.bl+D.r],[,D.br],
                [0,D.br],[3,D.bl],
                [1,D.bl+D.r],[,D.br],
                [0,D.b+D.br],[3,D.b+D.bl],
                [1,D.r],[,D.r]
            ],"9": [
                [1,D.r+D.bl],[,D.br],
                [0,D.br],[3,D.bl+D.b],
                [1,D.r],[],[,D.b],
                [3,D.b],
                [3],
            ]
        }
    }
}