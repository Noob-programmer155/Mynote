package com.amrtm.mynoteapps.entity.repository.bindfunction;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.utils.Tuple2;
import com.amrtm.mynoteapps.entity.other.utils.Tuple3;
import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import com.amrtm.mynoteapps.entity.theme.impl.Theme;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;

interface EntityBindFunction {
    MemberDTO MEMBER_DTO_BINDING (Tuple2<Member, Theme> item);
    NoteCollabDTO NOTE_COLLAB_DTO_BINDING(Tuple3<NoteCollab, Subtype, Member> item);
    NotePrivateDTO NOTE_PRIVATE_DTO_BINDING(NotePrivate item);
}
