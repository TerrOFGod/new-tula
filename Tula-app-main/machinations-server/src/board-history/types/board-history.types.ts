export declare enum MarkerType {
	Arrow = "arrow",
	ArrowClosed = "arrowclosed",
}

export type BoardEdgesType = "Default" | "SmoothStep" | "Bezier"

export type BoardHistoryType = "snapshot" | "patch"

export interface PositionValue {
	x: number
	y: number
}

export interface NodeDataValue {
	label: string | number
	struct: string
	name: string
}

export interface NodeValue {
	id: string
	type: string
	width: number
	height: number
	selected: boolean
	dragging: boolean
	positionAbsolute: PositionValue
	position: PositionValue
	data: NodeDataValue
}

export type EdgeMarkerType = MarkerType.Arrow | MarkerType.ArrowClosed

export interface EdgeMarkerEndValue {
	type: EdgeMarkerType
	width: number
	height: number
	color: string
}

export interface EdgeValue {
	source: string
	target: string
	id: string
	type: string
	animated: boolean
	data: number | string
	selected: boolean
	markerEnd?: string | EdgeMarkerEndValue
}

export interface BoardSnapshotData {
	nodes: NodeValue[]
	edges: EdgeValue[]
}

export type PatchOperation = "add" | "remove" | "replace"

export interface PatchValue {
	op: PatchOperation
	path: string
	value?: any
	oldValue?: any
}

export interface BoardPatchData {
	patches: PatchValue[]
	base: number
}

export type BoardHistoryData = BoardSnapshotData | BoardPatchData
