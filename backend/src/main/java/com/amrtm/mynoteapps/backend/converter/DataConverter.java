package com.amrtm.mynoteapps.backend.converter;

public interface DataConverter<D,DE> {
    DE convertTo(D data);
    D deconvert(DE data);
    D deconvert(DE data, D entity);
//    public static byte[] uuidToBinary(UUID uuid) {
//        if (uuid != null) {
//            byte[] data = new byte[16];
//            ByteBuffer.wrap(data)
//                    .order(ByteOrder.BIG_ENDIAN)
//                    .putLong(uuid.getMostSignificantBits())
//                    .putLong(uuid.getLeastSignificantBits());
//            return data;
//        } else
//            return null;
//    }
//
//    public static UUID BinaryToUuid(byte[] binary) {
//        if (binary != null && binary.length > 0) {
//            ByteBuffer data = ByteBuffer.wrap(binary);
//            return new UUID(data.getLong(),data.getLong());
//        } else
//            return null;
//    }
}