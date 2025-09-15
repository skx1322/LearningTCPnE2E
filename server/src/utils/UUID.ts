import { randomUUIDv5, randomUUIDv7 } from "bun";
import { SegmentLimit, UUIDFormat } from "../types/other.type";

export namespace UUIDUtil {
    export function UUIDHex(GenType: UUIDFormat = "hex", SegmentLength: SegmentLimit = 0) {
        const id = randomUUIDv7(GenType) || "";
        if (!id) {
            console.error("Something with wrong generating UUID HEX");
        }
        const idSegment = id.split("-")

        return idSegment.slice(SegmentLength, 5).join("")
    }

    export function UUIDV5(customString: string, SegmentLength: SegmentLimit = 0) {
        const id = randomUUIDv5(customString, "oid", "hex") || "";
        if (!id) {
            console.error("Something with wrong generating UUID HEX");
        }
        const idSegment = id.split("-")

        return idSegment.slice(SegmentLength, 5).join("-")
    }

}
