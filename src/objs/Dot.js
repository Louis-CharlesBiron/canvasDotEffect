// JS
// Canvas Dot Effect by Louis-Charles Biron
// Please don't use or credit this code as your own.
//

// The main component to create Effect, can be used on it's own, but designed to be contained by a Shape instance
class Dot extends _Obj {
    constructor(pos, radius, color, setupCB, anchorPos, activationMargin, disablePathCaching=false) {
        super(pos, radius, color, setupCB, null, anchorPos, activationMargin)
        this._connections = []  // array of Dot to eventually draw a connecting line to
        this._cachedPath = !disablePathCaching // the cached path2d object or null if path caching is disabled
    }

    // runs every frame, draws the dot and runs its parent drawEffect callback
    draw(render, time, deltaTime) {
        if (this.initialized) {
            const drawEffectCB = this.drawEffectCB
            if (drawEffectCB) {
                const dist = this.getDistance(), rawRatio = this.getRatio(dist), isActive = rawRatio<1, parent = this._parent
                drawEffectCB(render, this, isActive?rawRatio:1, parent.setupResults, parent.parent.mouse, dist, parent, isActive, rawRatio)
            }

            if (this._radius && (this.a??1) > Color.OPACITY_VISIBILITY_THRESHOLD) {
                const ctx = render.ctx, scaleX = this._scale[0], scaleY = this._scale[1], hasScaling = scaleX!==1||scaleY!==1, hasTransforms = hasScaling||(this._visualEffects?.[0]?.indexOf("#")!==-1)||this._rotation

                if (hasTransforms) {
                    let viewPos
                    if (hasScaling) {
                        const x = this._pos[0], y = this._pos[1]
                        viewPos = this.cvs.viewPos
                        ctx.translate(x, y)
                        if (this._rotation) ctx.rotate(CDEUtils.toRad(this._rotation))
                        ctx.scale(scaleX, scaleY)
                        ctx.translate(-x, -y)
                    }

                    render.fill(this._cachedPath||Render.getArc(this._pos, this._radius), this._color, this.visualEffects)
                    if (hasScaling) ctx.setTransform(1,0,0,1,viewPos[0],viewPos[1])
                } else render.batchFill(this._cachedPath||Render.getArc(this._pos, this._radius), this._color, this.visualEffects)
            }
        } else {
            this.initialized = true
            if (this._cachedPath) this.updateCachedPath()
        }
        super.draw(time, deltaTime)
    }

    // returns pythagorian distance between the ratio defining position and the dot
    getDistance(fx=this.ratioPos[0], fy=this.ratioPos[1]) {
        return CDEUtils.getDist(fx, fy, this.x, this.y)
    }

    // calculates the ratio based on distance and parent's limit
    getRatio(dist) {
        return dist / this.limit
    }

    // adds a dot to the connection array
    addConnection(dot) {
        if (dot instanceof Dot) this._connections.push(dot)
    }

    // removes a dot from the connection array
    removeConnection(dotOrId) {
        this._connections = this._connections.filter(d=>typeof dotOrId=="number"?d.id!==dotOrId:d.id!==dotOrId.id)
    }

    // deletes the dot
    remove() {
        this._parent.remove(this._id)
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

    // activates path caching and updates the cached path
    updateCachedPath() {
        this._cachedPath = Render.getArc(this._pos, this._radius)
    }

    // disables path caching
    disablePathCaching() {
        this._cachedPath = null
    }

    // returns a separate copy of this Dot
    duplicate(pos=this.getInitPos(), radius=this._radius, color=this._color, setupCB=this._setupCB, anchorPos=this._anchorPos, activationMargin=this._activationMargin, disablePathCaching=!this._cachedPath) {
        const colorObject = color, colorRaw = colorObject.colorRaw, dot = new Dot(
            pos,
            radius,
            (colorRaw instanceof Gradient||colorRaw instanceof Pattern) && colorRaw._initPositions.id != null && this._parent.id != null && colorRaw._initPositions.id == this._parent.id ? null:(_,dot)=>(colorRaw instanceof Gradient||colorRaw instanceof Pattern)?colorRaw.duplicate(Array.isArray(colorRaw.initPositions)?null:dot):colorObject.duplicate(),
            setupCB,
            anchorPos,
            activationMargin,
            disablePathCaching
        )

        dot._scale = CDEUtils.unlinkArr2(this._scale)
        dot._rotation = this._rotation
        dot._visualEffects = this.visualEffects_
        return dot
    }

    // returns whether the provided pos is in the dot pos, positions, padding,
    isWithin(pos, padding, rotation, scale) {
        return super.isWithin(pos, this.getBounds(padding, rotation, scale))
    }

    // returns whether the provided pos is in the image
    isWithinAccurate(pos, axisPadding, rotation, scale) {
        return this.ctx.isPointInPath(this.getBoundsAccurate(axisPadding, rotation, scale), pos[0], pos[1])
    }

    // returns the raw a minimal rectangular area containing all of the dot (no scale/rotation)
    #getRectBounds() {
        const pos = this._pos, radius = this._radius
        return [[pos[0]-radius, pos[1]-radius], [pos[0]+radius, pos[1]+radius]]
    }

    // returns the accurate area containing all of the dot
    getBoundsAccurate(axisPadding, rotation=this._rotation, scale=this._scale) {
        const radius = this._radius
        axisPadding??=0
        axisPadding = typeof axisPadding=="number" ? [axisPadding, axisPadding] : [axisPadding[0], axisPadding[1]??axisPadding[0]]
        return Render.getEllispe(this._pos, radius*scale[0]+axisPadding[0], radius*scale[1]+axisPadding[1], CDEUtils.toRad(rotation))
    }

    // returns the center pos of the image
    getCenter() {
        return this._pos
    }

    // returns the minimal rectangular area containing all of the dot
    getBounds(padding, rotation=this._rotation, scale=this._scale) {
        const positions = this.#getRectBounds()
        return super.getBounds(positions, padding, (scale[0]!=scale[1]&&(scale[0]!=1||scale[1]!=1))?rotation:0, scale, super.getCenter(positions))
    }

    get ctx() {return this.cvs.ctx}
    get cvs() {return this._parent.parent||this._parent}
    get render() {return this.cvs.render}
    get limit() {return this._parent.limit}
    get drawEffectCB() {return this._parent?.drawEffectCB}
    get mouse() {return this.cvs.mouse}
    get ratioPos() {return this._parent.ratioPos}
    get connections() {return this._connections}
    get parentSetupResults() {return this._parent?.setupResults}
    get top() {return this.y-this._radius*this._scale[1]}
    get bottom() {return this.y+this._radius*this._scale[1]}
    get right() {return this.x+this._radius*this._scale[0]}
    get left() {return this.x-this._radius*this._scale[0]}
    get width() {return this._radius*2*this._scale[0]}
    get height() {return this._radius*2*this._scale[1]}
    get x() {return super.x}
    get y() {return super.y}
    get pos() {return this._pos}
    get relativeX() {return super.relativeX}
    get relativeY() {return super.relativeY}
    get relativePos() {return super.relativePos}
    get radius() {return this._radius}
    get cachedPath() {return this._cachedPath}


    set x(x) {
        x = CDEUtils.round(x, _BaseObj.POSITION_PRECISION)
        if (this._pos[0] != x) {
            this._pos[0] = x
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set y(y) {
        y = CDEUtils.round(y, _BaseObj.POSITION_PRECISION)
        if (this._pos[1] != y) {
            this._pos[1] = y
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set pos(pos) {
        if (!CDEUtils.posEquals(pos, this._pos)) {
            this.x = pos[0]
            this.y = pos[1]
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set relativeX(x) {this.x = this.anchorPos[0]+x}
    set relativeY(y) {this.y = this.anchorPos[1]+y}
    set relativePos(pos) {
        this.relativeX = CDEUtils.round(pos[0], _BaseObj.POSITION_PRECISION)
        this.relativeY = CDEUtils.round(pos[1], _BaseObj.POSITION_PRECISION)
    }
    set radius(radius) {
        radius = CDEUtils.round(radius<0?0:radius, _Obj.RADIUS_PRECISION)
        if (this._radius != radius) {
            this._radius = radius
            if (this._cachedPath) this.updateCachedPath()
        }
    }
    set limit(limit) {this._parent.limit = limit}
    set connections(c) {return this._connections = c}
    set cachedPath(path) {this._cachedPath = path}
}