import { Component } from "react";
import HeaderView from "./view-controller/header-view";
import { NotificationViewForGroup, NotificationViewForMember } from "./view-controller/notification-view";
import { GroupAdapter } from "../configuration/adapter/group-adapter";
import { MemberAdapter } from "../configuration/adapter/member-adapter";
import { MainAdapter } from "../configuration/adapter/adapter";

export default class View extends Component{
    public groupAdapter?: GroupAdapter
    public memberAdapter?: MemberAdapter
    async componentDidMount() {
        this.groupAdapter = MainAdapter.GROUP
        this.memberAdapter = MainAdapter.MEMBER
    }

    render() {
        return(
            <>
                <HeaderView/>
                <NotificationViewForMember adapter={this.memberAdapter}/> 
                <NotificationViewForGroup adapter={this.groupAdapter}/>
            </>
        )
    }
}