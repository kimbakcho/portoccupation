import {DateTime} from "luxon";

export interface OccupationTimeData {
    startTime: DateTime;
    endTime: DateTime;
    durationSec: number
}