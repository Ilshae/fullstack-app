package com.praca_inzynierska.backend.file;

import com.praca_inzynierska.backend.file.responseBody.FIdNameUrl;
import com.praca_inzynierska.backend.yacht.Yacht;
import com.praca_inzynierska.backend.yacht.YachtRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class FileController {
  final FileDBRepository fileDBRepository;
  final YachtRepository yachtRepository;
  private final FileStorageService storageService;

  public FileController(FileDBRepository fileDBRepository, YachtRepository yachtRepository, FileStorageService storageService) {
    this.fileDBRepository = fileDBRepository;
    this.yachtRepository = yachtRepository;
    this.storageService = storageService;
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/upload")
  public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam(required = false) Long yachtId) {
    String message;
    try {
      if (yachtId == null)
        storageService.store(file);
      else {
        Yacht yacht;
        if(yachtRepository.findById(yachtId).isPresent()) yacht = yachtRepository.findById(yachtId).get();
        else return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Could not upload the file: " + file.getOriginalFilename() + "!"));
        storageService.store(file, yacht);
      }
      message = "Uploaded the file successfully: " + file.getOriginalFilename();
      return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
    } catch (Exception e) {
      message = "Could not upload the file: " + file.getOriginalFilename() + "!";
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }
  }

  @GetMapping("/files")
  public ResponseEntity<List<FIdNameUrl>> getListFiles(@RequestParam() long yachtId) {
    try {
      List<FIdNameUrl> files = storageService.getFilesByYachtId(yachtId).map(dbFile -> {
        String fileDownloadUri = ServletUriComponentsBuilder
          .fromCurrentContextPath()
          .path("/api/files/")
          .path(String.valueOf(dbFile.getId()))
          .toUriString();
        return new FIdNameUrl(dbFile.getId(), dbFile.getName(),fileDownloadUri);
      }).collect(Collectors.toList());
      return ResponseEntity.status(HttpStatus.OK).body(files);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/firstFile")
  public ResponseEntity<FIdNameUrl> getFile(@RequestParam() long yachtId) {
    try {
      FileDB dbFile = storageService.getFirstFileByYachtId(yachtId);
      String fileDownloadUri = ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("/api/files/")
        .path(String.valueOf(dbFile.getId()))
        .toUriString();
      return ResponseEntity.status(HttpStatus.OK).body(new FIdNameUrl(dbFile.getId(), dbFile.getName(), fileDownloadUri));
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/files/{id}")
  public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
    try {
      FileDB fileDB = storageService.getFile(id);
      return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
        .body(fileDB.getData());
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/files/{fileId}/yacht/{yachtId}")
  ResponseEntity<HttpStatus> assignYachtToFileDB(
    @PathVariable Long fileId,
    @PathVariable Long yachtId
  ) {
    try {
      FileDB fileDB;
      if(fileDBRepository.findById(fileId).isPresent()) fileDB = fileDBRepository.findById(fileId).get();
      else return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      Yacht yacht;
      if(yachtRepository.findById(yachtId).isPresent()) yacht = yachtRepository.findById(yachtId).get();
      else return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      fileDB.setYacht(yacht);
      fileDBRepository.save(fileDB);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/files/{id}")
  public ResponseEntity<HttpStatus> deleteFile(@PathVariable("id") long id) {
    try {
      fileDBRepository.deleteById(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
