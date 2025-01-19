// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// The main component to create Effect, can be used on it's on, but designed to be contained by a Shape instance
class Dot extends Obj {
    constructor(pos, radius, color, setupCB, anchorPos, alwaysActive) {
        super(pos, radius, color, setupCB, anchorPos, alwaysActive)
        this._parent = null               // the instance containing the dot's parent (Shape)
        this._connections = []            // array of Dot to draw a connecting line to
    }

    // runs every frame, draws the dot and runs its parent drawEffect callback
    draw(ctx, time, deltaTime) {
        super.draw(ctx, time, deltaTime)
        
        if (this.initialized) {
            // runs parent drawEffect callback if defined
            if (typeof this.drawEffectCB == "function") {
                let dist = this.getDistance(), rawRatio = this.getRatio(dist)
                this.drawEffectCB(ctx, this, Math.min(1, rawRatio), this.cvs.mouse, dist, this._parent, rawRatio)
            }

            // draw dot
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this._radius, 0, CDEUtils.CIRC)
            ctx.fill()
        } else this.initialized = true
    }

    
    // returns a separate copy of this Dot (only initialized for objects)
    duplicate() {
        return this.initialized ? new Dot(this.pos_, this.radius, this.colorObject.duplicate(), this.setupCB) : null
    }

    // returns pythagorian distance between the ratio defining position and the dot
    getDistance(fx,fy) {
        return CDEUtils.getDist(fx??this.ratioPos[0], fy??this.ratioPos[1], this.x, this.y)
    }

    // calculates the ratio based on distance and parent's limit
    getRatio(dist) {
        return dist / this.limit
    }

    // adds a Dot to the connection array
    addConnection(dot) {
        if (dot instanceof Dot) this._connections.push(dot)
    }

    // removes a Dot from the connection array
    removeConnection(dotOrId) {
        this._connections = this._connections.filter(d=>typeof dotOrId=="number"?d.id!==dotOrId:d.id!==dotOrId.id)
    }

    /**
     * Calculates the 4 intersection points between two dots and a direct line between them.
     * @param {Dot | pos} target: a Dot or a pos [x,y] (Defaults to the first Dot in this object's connections list)
     * @param {Number} targetPadding: the padding radius of the target (Defaults to the target radius if it's a Dot, or 5)
     * @param {Dot | pos} source: a Dot or a pos [x,y] (Defaults to this object)
     * @param {Number} sourcePadding: the padding radius of the source (Defaults to the source radius if it's a Dot, or 5)
     * @returns {
     *      source: [ [x, y], [x, y] ]
     *      target: [ [x, y], [x, y] ]
     * } The 2 intersection points for the target and for the source
     */
    getLinearIntersectPoints(target=this._connections[0], targetPadding=target.radius??5, source=this, sourcePadding=this.radius??5) {
        let [tx, ty] = target.pos||target, [sx, sy] = source.pos||source,
            [a, b, lfn] = CDEUtils.getLinearFn([sx,sy], [tx,ty]), t_r = targetPadding**2, s_r = sourcePadding**2,
            qA = (1+a**2)*2,
            s_qB = -(2*a*(b-sy)-2*sx),
            s_qD = Math.sqrt(s_qB**2-(4*(qA/2)*((b-sy)**2+sx**2-s_r))),
            t_qB = -(2*a*(b-ty)-2*tx),
            t_qD = Math.sqrt(t_qB**2-(4*(qA/2)*((b-ty)**2+tx**2-t_r))),
            s_x1 = (s_qB+s_qD)/qA, s_x2 = (s_qB-s_qD)/qA, t_x1 = (t_qB+t_qD)/qA, t_x2 = (t_qB-t_qD)/qA,
            s_y1 = lfn(s_x1), s_y2 = lfn(s_x2), t_y1 = lfn(t_x1), t_y2 = lfn(t_x2)
    
        return {source:{inner:[s_x1, s_y1], outer:[s_x2, s_y2]}, target:{outer:[t_x1, t_y1], inner:[t_x2, t_y2]}}
    }

    // deletes the dot
    remove() {
        this._parent.removeDot(this._id)
    }

    get cvs() {return this._parent?.cvs}
    get ctx() {return this._parent?.cvs.ctx}
    get limit() {return this._parent?.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get parent() {return this._parent}
    get ratioPos() {return this._parent?.ratioPos}
    get connections() {return this._connections}

    set limit(limit) {this._parent.limit = limit}
    set parent(p) {this._parent = p}
    set connections(c) {return this._connections = c}
}