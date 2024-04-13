package com.praca_inzynierska.backend.file;

import com.praca_inzynierska.backend.yacht.Yacht;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class FileStorageService {
  @Autowired
  private FileDBRepository fileDBRepository;

  public void store(MultipartFile file) throws IOException {
    String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
    try {
      fileDBRepository.save(new FileDB(fileName, file.getContentType(), file.getBytes()));
    } catch (Exception e) {
      throw(e);
    }
  }

  public void store(MultipartFile file, Yacht yacht) throws IOException {
    String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
    try {
      fileDBRepository.save(new FileDB(fileName, file.getContentType(), file.getBytes(), yacht));
    } catch (Exception e) {
      throw(e);
    }
  }

  public FileDB getFile(Long id) {
    return fileDBRepository.findById(id).get();
  }

  public Stream<FileDB> getFilesByYachtId(Long yachtId) {
    return fileDBRepository.findByYachtId(yachtId).stream();
  }

  public FileDB getFirstFileByYachtId(Long yachtId) {
    return fileDBRepository.findByYachtId(yachtId).get(0);
  }
}