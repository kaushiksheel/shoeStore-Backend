const Joi=require('joi');

function SignupValidation(obj){
    const schema=Joi.object({
        fullname:Joi.string().min(5).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(5).required()
    })

const {error}=schema.validate(obj)
return error
}
function LoginValidation(obj){
    const schema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(5).required()
    })

const {error}=schema.validate(obj)
return error
}


module.exports={SignupValidation,LoginValidation};