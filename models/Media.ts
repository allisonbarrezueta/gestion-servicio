import { Model } from "@tailflow/laravel-orion/lib/model";
// import { UserType } from "./../types";

export default class Media extends Model<{ url: string }> {
    public $resource(): string {
        return "medias";
    }
}
