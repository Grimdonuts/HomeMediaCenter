using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using mediaserver.Models;
using mediaserver.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace mediaserver.Controllers
{
    [Route("/")]
    [ApiController]
    public class MediaServerController : Controller
    {
        private readonly PlaylistService _playlistService;

        public MediaServerController(PlaylistService playlistService)
        {
            _playlistService = playlistService;
        }

        [HttpGet]
        [Route("filenames")]
        public JsonResult FileNames()
        {
            List<FileStructure> filesFound = new List<FileStructure>();
            try
            {
                PhysicalFileProvider rootProvider = new PhysicalFileProvider(Directory.GetCurrentDirectory() + "/assets");
                IOrderedEnumerable<IFileInfo> rootContents = rootProvider.GetDirectoryContents(string.Empty).OrderBy(x => x.Name);
                foreach (var item in rootContents)
                {
                    string videoName = null;
                    string folderFound = null;
                    string imageFound = null;
                    int indexCount = 0;
                    List<VideosInFolder> folderChildren = null;
                    if (item.Name.EndsWith(".mp4"))
                    {
                        videoName = item.Name;
                        imageFound = item.Name.Replace(".mp4", ".jpg");
                        filesFound.Add(new FileStructure
                        {
                            video = videoName,
                            folder = folderFound,
                            image = imageFound,
                            index = indexCount,
                            children = folderChildren
                        });
                    }
                    else if (item.IsDirectory)
                    {
                        folderFound = item.Name;
                        imageFound = item.Name + ".jpg";
                        IOrderedEnumerable<IFileInfo> contents = rootProvider.GetDirectoryContents(item.Name).OrderBy(x => x.Name);
                        folderChildren = new List<VideosInFolder>();
                        foreach (var videoFile in contents)
                        {
                            folderChildren.Add(new VideosInFolder() { video = videoFile.Name });
                        }
                        filesFound.Add(new FileStructure
                        {
                            video = videoName,
                            folder = folderFound,
                            image = imageFound,
                            index = indexCount,
                            children = folderChildren
                        });
                    }
                    indexCount++;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return Json(filesFound);
        }

        [HttpGet]
        [Route("image")]
        public FileStreamResult GetImage(string video)
        {
            FileStream fs = System.IO.File.OpenRead(Directory.GetCurrentDirectory() + "/assets/" + video);
            FileStreamResult videoProcessed = new FileStreamResult(fs, "image/jpeg");
            videoProcessed.EnableRangeProcessing = true;
            return videoProcessed;
        }

        [HttpGet]
        [Route("video")]
        public FileStreamResult GetVideo(string video)
        {
            try
            {
                if (System.IO.File.Exists(Directory.GetCurrentDirectory() + "/assets/" + video) && !Directory.Exists(Directory.GetCurrentDirectory() + "/assets/" + video))
                {
                    FileStream fs = System.IO.File.OpenRead(Directory.GetCurrentDirectory() + "/assets/" + video);
                    FileStreamResult videoProcessed = new FileStreamResult(fs, "video/mp4");
                    videoProcessed.EnableRangeProcessing = true;
                    return videoProcessed;
                }
                else
                {
                    string[] files = Directory.GetFiles(Directory.GetCurrentDirectory() + "/assets", video, SearchOption.AllDirectories);
                    if (files.Count() > 0)
                    {
                        FileStream fs = System.IO.File.OpenRead(files[0]);
                        FileStreamResult videoProcessed = new FileStreamResult(fs, "video/mp4");
                        videoProcessed.EnableRangeProcessing = true;
                        return videoProcessed;
                    }
                    else
                    {
                        throw new Exception("Video not found");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine(ex.InnerException);
                Console.WriteLine(ex.Data);
                FileStreamResult errorResult = null;
                return errorResult;
            }
        }

        [HttpGet]
        [Route("foldercheck")]
        public JsonResult FolderCheck(string filename)
        {
            try
            {
                if (System.IO.File.Exists(Directory.GetCurrentDirectory() + "/assets/" + filename) && !Directory.Exists(Directory.GetCurrentDirectory() + "/assets/" + filename))
                {
                    return Json(null);
                }
                else
                {
                    string nextFile = "";
                    string previousFile = "";
                    string[] files = Directory.GetFiles(Directory.GetCurrentDirectory() + "/assets", filename, SearchOption.AllDirectories);
                    if (files.Count() > 0)
                    {
                        DirectoryInfo parentDirectory = Directory.GetParent(files[0]);
                        PhysicalFileProvider folderProvider = new PhysicalFileProvider(parentDirectory.FullName);
                        List<IFileInfo> rootContents = folderProvider.GetDirectoryContents(string.Empty).OrderBy(x => x.Name).ToList();
                        List<NextPrevious> nextPrevious = new List<NextPrevious>();
                        for (int i = 0; i < rootContents.Count(); i++)
                        {
                            if (rootContents[i].Name == filename)
                            {
                                if (i != 0)
                                {
                                    previousFile = rootContents[i - 1].Name;
                                }
                                if ((i + 1) != rootContents.Count())
                                {
                                    nextFile = rootContents[i + 1].Name;
                                }
                            }
                        }
                        nextPrevious.Add(new NextPrevious { previous = previousFile, next = nextFile });
                        return Json(nextPrevious);
                    }
                    else
                    {
                        throw new Exception("Video not found");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine(ex.InnerException);
                Console.WriteLine(ex.Data);
                return Json(null);
            }
        }
    }
}