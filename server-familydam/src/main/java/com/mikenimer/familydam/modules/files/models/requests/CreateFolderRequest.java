package com.mikenimer.familydam.modules.files.models.requests;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateFolderRequest {
    String parentId;
    String name;
}
