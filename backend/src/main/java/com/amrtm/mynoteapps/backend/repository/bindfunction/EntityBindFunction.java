package com.amrtm.mynoteapps.backend.repository.bindfunction;

import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import com.amrtm.mynoteapps.backend.model.theme.impl.Theme;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNote;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;

import java.util.List;

interface EntityBindFunction {
    MemberDTO MEMBER_DTO_BINDING (Tuple2<Member, Theme> item);
    NoteCollabDTO NOTE_COLLAB_DTO_BINDING(Tuple3<NoteCollab, Subtype, Member> item);
    NotePrivateDTO NOTE_PRIVATE_DTO_BINDING(Tuple2<NotePrivate, Member> item);
}
