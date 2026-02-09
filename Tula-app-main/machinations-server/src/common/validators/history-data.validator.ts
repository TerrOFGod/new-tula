// src/common/validators/history-data.validator.ts
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator"
import {
	BoardHistoryData,
	BoardPatchData,
	BoardSnapshotData,
} from "../../board-history/types/board-history.types"

@ValidatorConstraint({ name: "isValidHistoryData", async: false })
export class IsValidHistoryData implements ValidatorConstraintInterface {
	validate(data: BoardHistoryData, args: ValidationArguments) {
		const type = (args.object as any).type

		if (type === "snapshot") {
			return this.validateSnapshot(data as BoardSnapshotData)
		}

		if (type === "patch") {
			return this.validatePatch(data as BoardPatchData)
		}

		return false
	}

	private validateSnapshot(data: BoardSnapshotData): boolean {
		return (
			Array.isArray(data.nodes) &&
			Array.isArray(data.edges) &&
			data.nodes.every(this.validateNode) &&
			data.edges.every(this.validateEdge)
		)
	}

	private validatePatch(data: BoardPatchData): boolean {
		return (
			typeof data.base === "number" &&
			Array.isArray(data.patches) &&
			data.patches.every(
				(p) =>
					["add", "remove", "replace"].includes(p.op) &&
					typeof p.path === "string",
			)
		)
	}

	private validateNode(node: any): boolean {
		return (
			typeof node.id === "string" &&
			typeof node.type === "string" &&
			typeof node.width === "number" &&
			typeof node.height === "number" &&
			typeof node.position?.x === "number" &&
			typeof node.position?.y === "number"
		)
	}

	private validateEdge(edge: any): boolean {
		return (
			typeof edge.source === "string" &&
			typeof edge.target === "string" &&
			typeof edge.id === "string" &&
			typeof edge.type === "string"
		)
	}

	defaultMessage(args: ValidationArguments) {
		return `Invalid history data structure for type ${
			(args.object as any).type
		}`
	}
}
