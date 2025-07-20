using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CongTyDuLich
{
    [Key]
    public string MaCTY { get; set; }
    public string TenCTY { get; set; }
    public string MaSoThue { get; set; }
    public ICollection<XeDuLich> XeDuLiches { get; set; }
}
