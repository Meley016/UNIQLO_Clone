using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTourWebApp.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationshipForHDV : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CongTyDuLiches",
                columns: table => new
                {
                    MaCTY = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenCTY = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaSoThue = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CongTyDuLiches", x => x.MaCTY);
                });

            migrationBuilder.CreateTable(
                name: "HuongDanViens",
                columns: table => new
                {
                    MaHDV = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenHDV = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoCCCD = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LuongNgay = table.Column<float>(type: "real", nullable: false),
                    SoNgayLam = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HuongDanViens", x => x.MaHDV);
                });

            migrationBuilder.CreateTable(
                name: "LoaiXes",
                columns: table => new
                {
                    MaLoai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenLoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoGhe = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiXes", x => x.MaLoai);
                });

            migrationBuilder.CreateTable(
                name: "TaiXes",
                columns: table => new
                {
                    MaTX = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenTX = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoCCCD = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LuongCoBan = table.Column<float>(type: "real", nullable: false),
                    HeSoLuong = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiXes", x => x.MaTX);
                });

            migrationBuilder.CreateTable(
                name: "XeDuLiches",
                columns: table => new
                {
                    SoXe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaLoai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaCTY = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XeDuLiches", x => x.SoXe);
                    table.ForeignKey(
                        name: "FK_XeDuLiches_CongTyDuLiches_MaCTY",
                        column: x => x.MaCTY,
                        principalTable: "CongTyDuLiches",
                        principalColumn: "MaCTY",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_XeDuLiches_LoaiXes_MaLoai",
                        column: x => x.MaLoai,
                        principalTable: "LoaiXes",
                        principalColumn: "MaLoai",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongChuyenDis",
                columns: table => new
                {
                    MaHopDong = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Ngay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoXe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaTX = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaHDV1 = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaHDV2 = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDongChuyenDis", x => x.MaHopDong);
                    table.ForeignKey(
                        name: "FK_HopDongChuyenDis_HuongDanViens_MaHDV1",
                        column: x => x.MaHDV1,
                        principalTable: "HuongDanViens",
                        principalColumn: "MaHDV",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HopDongChuyenDis_HuongDanViens_MaHDV2",
                        column: x => x.MaHDV2,
                        principalTable: "HuongDanViens",
                        principalColumn: "MaHDV",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HopDongChuyenDis_TaiXes_MaTX",
                        column: x => x.MaTX,
                        principalTable: "TaiXes",
                        principalColumn: "MaTX",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HopDongChuyenDis_XeDuLiches_SoXe",
                        column: x => x.SoXe,
                        principalTable: "XeDuLiches",
                        principalColumn: "SoXe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LichChays",
                columns: table => new
                {
                    Ngay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoXe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaHopDong = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DiemDi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiemDen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaVe = table.Column<float>(type: "real", nullable: false),
                    SoKhachDi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichChays", x => x.Ngay);
                    table.ForeignKey(
                        name: "FK_LichChays_HopDongChuyenDis_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDongChuyenDis",
                        principalColumn: "MaHopDong",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LichChays_XeDuLiches_SoXe",
                        column: x => x.SoXe,
                        principalTable: "XeDuLiches",
                        principalColumn: "SoXe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HopDongChuyenDis_MaHDV1",
                table: "HopDongChuyenDis",
                column: "MaHDV1");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongChuyenDis_MaHDV2",
                table: "HopDongChuyenDis",
                column: "MaHDV2");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongChuyenDis_MaTX",
                table: "HopDongChuyenDis",
                column: "MaTX");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongChuyenDis_SoXe",
                table: "HopDongChuyenDis",
                column: "SoXe");

            migrationBuilder.CreateIndex(
                name: "IX_LichChays_MaHopDong",
                table: "LichChays",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_LichChays_SoXe",
                table: "LichChays",
                column: "SoXe");

            migrationBuilder.CreateIndex(
                name: "IX_XeDuLiches_MaCTY",
                table: "XeDuLiches",
                column: "MaCTY");

            migrationBuilder.CreateIndex(
                name: "IX_XeDuLiches_MaLoai",
                table: "XeDuLiches",
                column: "MaLoai");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LichChays");

            migrationBuilder.DropTable(
                name: "HopDongChuyenDis");

            migrationBuilder.DropTable(
                name: "HuongDanViens");

            migrationBuilder.DropTable(
                name: "TaiXes");

            migrationBuilder.DropTable(
                name: "XeDuLiches");

            migrationBuilder.DropTable(
                name: "CongTyDuLiches");

            migrationBuilder.DropTable(
                name: "LoaiXes");
        }
    }
}
