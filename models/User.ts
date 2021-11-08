import { Model } from "@tailflow/laravel-orion/lib/model";
import { UserType } from "./../types";

export default class User extends Model<UserType> {
    public $resource(): string {
        return "categories";
    }
}
