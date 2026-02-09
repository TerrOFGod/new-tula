import { ClassSerializerInterceptor, PlainLiteralObject } from "@nestjs/common"
import { ClassTransformOptions } from "class-transformer"

export class TransformInterceptor extends ClassSerializerInterceptor {
	serialize(
		response: PlainLiteralObject | Array<PlainLiteralObject>,
		options: ClassTransformOptions,
	): PlainLiteralObject | PlainLiteralObject[] {
		return super.serialize(response, options)
	}
}
