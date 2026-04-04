import ApiError from "../utils/api-error.js";

const validate = (Dtoclass) => {
    
    return (req, res, next) => {
        console.log(req.body);
        const {errors, value} = Dtoclass.validate(req.body)
        if(errors){
            throw ApiError.badRequest(errors.join("; "))
        }
        req.body = value
        next()
    }
}


export default validate