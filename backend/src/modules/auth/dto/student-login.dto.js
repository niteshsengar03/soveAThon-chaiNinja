import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class StudentLoginDto extends BaseDto {
    static schema = Joi.object({
        regNo: Joi.string().required(),
        name: Joi.string().optional(),
    });
}

export default StudentLoginDto;