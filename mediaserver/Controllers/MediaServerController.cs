using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
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
        public FileResult GetImage(string video)
        {
            return PhysicalFile(Directory.GetCurrentDirectory() + "/assets/" + video, "image/jpeg");
        }

        [HttpGet]
        [Route("video")]
        public FileResult GetVideo(string video)
        {
            try
            {
                if (System.IO.File.Exists(Directory.GetCurrentDirectory() + "/assets/" + video) && !Directory.Exists(Directory.GetCurrentDirectory() + "/assets/" + video))
                {
                    return PhysicalFile(Directory.GetCurrentDirectory() + "/assets/" + video, "application/octet-stream", enableRangeProcessing: true);
                }
                else
                {
                    string[] files = Directory.GetFiles(Directory.GetCurrentDirectory() + "/assets", video, SearchOption.AllDirectories);
                    if (files.Count() > 0)
                    {
                        return PhysicalFile(files[0], "application/octet-stream", enableRangeProcessing: true);
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

        [HttpPost]
        [Route("playlistcreate")]
        public async System.Threading.Tasks.Task<RedirectResult> PlaylistCreate()
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                string body = await reader.ReadToEndAsync();
                body = body.Replace("+", " ").Replace("=on", "");
                Stack<string> brokenOutPlayStack = new Stack<string>();
                string[] brokenOutPlaylist = body.Split('&');
                foreach (var item in brokenOutPlaylist) { brokenOutPlayStack.Push(item); }
                string playlistId = brokenOutPlayStack.Pop().Replace("playlistid=", "");
                string playlistName = brokenOutPlayStack.Pop().Replace("playlistname=", "");
                if (playlistId != "")
                {
                    _playlistService.Update(new PlaylistModel { Id = playlistId, playlistname = playlistName, videos = brokenOutPlayStack, __v = 0 });
                }
                else
                {
                    PlaylistModel newDoc = _playlistService.Create(new PlaylistModel { playlistname = playlistName, videos = brokenOutPlayStack, __v = 0 });
                    playlistId = newDoc.Id;
                }
                string referrer = Request.Headers["Referer"].ToString() + "playlistorder?id=" + playlistId;
                return Redirect(referrer);
            }
        }

        [HttpGet]
        [Route("playlist")]
        public PlaylistModel GetPlaylist(string id)
        {
            PlaylistModel newDoc = _playlistService.Get(id);
            Stack<string> reversedList = new Stack<string>();
            foreach(var item in newDoc.videos)
            {
                reversedList.Push(item);
            }
            newDoc.videos = reversedList;
            return newDoc;
        }

        [HttpGet]
        [Route("playlists")]
        public List<PlaylistModel> GetPlaylists()
        {
            List<PlaylistModel> newDocs = _playlistService.Get();
            foreach(var document in newDocs)
            {
                Stack<string> reversedList = new Stack<string>();
                foreach (var item in document.videos)
                {
                    reversedList.Push(item);
                }
                document.videos = reversedList;
            }
            return newDocs;
        }

        [HttpPost]
        [Route("playlistorder")]
        public async System.Threading.Tasks.Task<RedirectResult> PlaylistOrder()
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                string body = await reader.ReadToEndAsync();
                body = body.Replace("+", " ").Replace("video=", "");
                Stack<string> brokenOutPlayStack = new Stack<string>();
                string[] brokenOutPlaylist = body.Split('&');
                foreach (var item in brokenOutPlaylist) { brokenOutPlayStack.Push(item); }
                string playlistId = brokenOutPlayStack.Pop().Replace("playlistId=", "");
                string playlistName = _playlistService.Get(playlistId).playlistname;
                _playlistService.Update(new PlaylistModel { Id = playlistId, playlistname = playlistName, videos = brokenOutPlayStack, __v = 0 });
                string referrer = Request.Headers["Referer"].ToString() + "playlists";
                return Redirect(referrer);
            }
        }
    }
}