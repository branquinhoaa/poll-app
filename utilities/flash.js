module.exports = {

    flash: function (req, typ, intr, messag){
        return (
            req.session.flash = {
                type: typ,
                intro: intr,
                message: messag,
            }
        )
    }

}