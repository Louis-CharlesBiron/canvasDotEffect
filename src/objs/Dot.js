// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// The main component to create Effect, can be used on it's own, but designed to be contained by a Shape instance
class Dot extends _Obj {
    constructor(pos, radius, color, setupCB, anchorPos, alwaysActive) {
        super(pos, radius, color, setupCB, null, anchorPos, alwaysActive)
        this._connections = []  // array of Dot to eventually draw a connecting line to
    }

    // runs every frame, draws the dot and runs its parent drawEffect callback
    draw(render, time, deltaTime) {
        if (this.initialized) {
            const drawEffectCB = this.drawEffectCB
            if (drawEffectCB) {
                const dist = this.getDistance(), rawRatio = this.getRatio(dist), isActive = rawRatio<1, parent = this._parent
                drawEffectCB(render, this, isActive?rawRatio:1, parent.setupResults, parent.parent.mouse, dist, parent, isActive, rawRatio)
            }

            if (this._radius) {
                const ctx = render.ctx, x = this._pos[0], y = this._pos[1], scaleX = this._scale[0], scaleY = this._scale[1], hasScaling = scaleX!==1||scaleY!==1, hasTransforms = hasScaling||(this._visualEffects?.[0]?.indexOf("#")!==-1)||this._rotation

                if (hasTransforms) {
                    if (hasScaling) {
                        ctx.translate(x, y)
                        ctx.scale(scaleX, scaleY)
                        if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                        ctx.translate(-x, -y)
                    }

                    render.fill(Render.getArc(this._pos, this._radius, 0, CDEUtils.CIRC), this._color, this.visualEffects)
                    if (hasScaling) ctx.setTransform(1,0,0,1,0,0)
                } else render.batchFill(Render.getArc(this._pos, this._radius, 0, CDEUtils.CIRC), this._color, this.visualEffects)
            }
        } else this.initialized = true
        super.draw(time, deltaTime)
    }

    
    // returns a separate copy of this Dot
    duplicate() {
        const dot = new Dot(
            this.getInitPos(),
            this._radius,
            this._color.duplicate(),
            this._setupCB
        )

        dot._scale = CDEUtils.unlinkArr2(this._scale)
        dot._rotation = this._rotation
        dot._visualEffects = this.visualEffects_
        return dot
    }

    // returns pythagorian distance between the ratio defining position and the dot
    getDistance(fx=this.ratioPos[0], fy=this.ratioPos[1]) {
        return CDEUtils.getDist(fx, fy, this.x, this.y)
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
     * Calculates the 4 intersection points between two dots and a direct line going through them.
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
        const [tx, ty] = target.pos??target, [sx, sy] = source.pos??source,
            [a, b, lfn] = CDEUtils.getLinearFn([sx,sy], [tx,ty]), t_r = targetPadding**2, s_r = sourcePadding**2,
            qA = (1+a**2)*2,
            s_qB = -(2*a*(b-sy)-2*sx),
            s_qD = Math.sqrt(s_qB**2-(4*(qA/2)*((b-sy)**2+sx**2-s_r))),
            t_qB = -(2*a*(b-ty)-2*tx),
            t_qD = Math.sqrt(t_qB**2-(4*(qA/2)*((b-ty)**2+tx**2-t_r))),
            s_x1 = (s_qB+s_qD)/qA, s_x2 = (s_qB-s_qD)/qA, t_x1 = (t_qB+t_qD)/qA, t_x2 = (t_qB-t_qD)/qA,
            s_y1 = lfn(s_x1), s_y2 = lfn(s_x2), t_y1 = lfn(t_x1), t_y2 = lfn(t_x2)
        return [[[s_x1, s_y1], [s_x2, s_y2]], [[t_x2, t_y2], [t_x1, t_y1]]]
    }

    // deletes the dot
    remove() {
        this._parent.remove(this._id)
    }

    get ctx() {return this._parent.parent.ctx}
    get render() {return this._parent.parent.render}
    get limit() {return this._parent.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get mouse() {return this._parent.parent.mouse}
    get ratioPos() {return this._parent.ratioPos}
    get connections() {return this._connections}
    get parentSetupResults() {return this._parent?.setupResults}

    set limit(limit) {this._parent.limit = limit}
    set connections(c) {return this._connections = c}
}