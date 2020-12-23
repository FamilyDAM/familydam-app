package com.mikenimer.familydam.modules.files.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateFolderRequest {
    String parentId;
    String name;
}
