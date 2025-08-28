import { randomUUIDv5, randomUUIDv7 } from "bun";

type UUIDFormat = "hex";
type SegmentLimit = 0 | 1 | 2 | 3 | 4;

export function UUIDHex(GenType: UUIDFormat = "hex", SegmentLength: SegmentLimit = 0) {
    const id = randomUUIDv7(GenType) || "";
    if (!id) {
        console.error("Something with wrong generating UUID HEX");
    }
    const idSegment = id.split("-")
    
    return idSegment.slice(SegmentLength, 5).join("")
}

export function UUIDV5(GenType: UUIDFormat = "hex", SegmentLength: SegmentLimit = 0) {
    const id = randomUUIDv5("fuhua", "oid", "hex") || "";
    if (!id) {
        console.error("Something with wrong generating UUID HEX");
    }
    const idSegment = id.split("-")
    
    return idSegment.slice(SegmentLength, 5).join("-")
}

// console.log(UUIDHex("hex", 0));
// console.log(UUIDHex("hex", 1));
// console.log(UUIDHex("hex", 2));
// console.log(UUIDHex("hex", 3));
// console.log(UUIDHex("hex", 4));

console.log(UUIDV5("hex"));;