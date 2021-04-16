using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mediaserver.Models
{
    public class FileStructure
    {
        public string video { get; set; }
        public string folder { get; set; }
        public string image { get; set; }
        public int index { get; set; }
        public List<VideosInFolder> children { get; set; }
    }

    public class VideosInFolder
    {
        public string video { get; set; }
    }

    public class NextPrevious
    {
        public string next { get; set; }
        public string previous { get; set; }
    }
}
