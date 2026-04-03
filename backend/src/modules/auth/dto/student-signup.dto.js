import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class StudentSignupDto extends BaseDto {
    static schema = Joi.object({
        regNo: Joi.string().required(),
        password: Joi.string().min(8).required(),
    });
}

export default StudentSignupDto;