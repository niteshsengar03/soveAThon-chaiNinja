import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateBroadcastDto extends BaseDto {
  static schema = Joi.object({
    content: Joi.string().trim().max(1000).required(),
    imageUrl: Joi.string().uri().optional(),
  });
}

export default CreateBroadcastDto;